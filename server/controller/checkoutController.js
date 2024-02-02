const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const Product = require('../models/products');


// Razorpay instance 
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

exports.checkout = async (req, res) => {
  const id = req.user.id;
  const user = await Users.findById(id);
  const addres = user.addresses;
  const total = await Cart.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(id),
      }
    },
    {
      $unwind: '$items'
    },
    {
      $project: {
        productId: '$items.productId',
        quantity: '$items.quantity',
        subTotal: '$items.subTotal',
      }
    },
    {
      $lookup: {
        from: 'books',
        localField: 'productId',
        foreignField: '_id',
        as: 'cartItem',
      }
    },
    {
      $project: {
        productId: 1,
        quantity: 1,
        subTotal: 1,
        cartItem: { $arrayElemAt: ['$cartItem', 0] },
      }
    },
    {
      $group: {
        _id: null,
        cartItem: { $push: '$cartItem' },
        totalPrice: {
          $sum: '$subTotal'
        },
      }
    }
  ]);
  const items = total[0].cartItem;
  const totalPrice = total[0].totalPrice;
  const CouponCode = req.query.couponCode;
  const offer = await Coupon.findOne({ couponCode: CouponCode, expireDate: { $gt: Date.now() } });
  const value = offer ? offer.discount : 0;
  const discount = Math.round((value * totalPrice) / 100);
  const payableTotal = totalPrice - discount;
  const search = req.query.searchQuery || '';
  if (search !== '') {
    res.redirect('/shop-page');
  }
  res.render('checkout', { user: user, address: addres, totalPrice: totalPrice, coupon: discount, mrp: payableTotal, cart: items, CouponCode: CouponCode });
}

exports.changeAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const existingAddress = await Users.findOne({
      _id: userId,
      'addresses': {
        $elemMatch: {
          _id: id,
        }
      }
    });
    if (!existingAddress) {
      return res.status(404).send('Address not found');
    }
    const updatedUser = await Users.aggregate([
      {
        "$unwind": "$addresses"
      },
      {
        "$match": {
          "addresses._id": new mongoose.Types.ObjectId(id)
        }
      },
      {
        "$project": {
          "addresses": 1,
        }
      }
    ]);
    res.status(200).json({ address: updatedUser[0].addresses });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


exports.payment = async (req, res) => {
  res.render('checkout');
}

exports.proceedToPayment = async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: "rcptid"
  };
  try {
    instance.orders.create(options, (err, order) => {
      res.send({ orderId: order.id })
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.getOrder = async (req, res) => {
  try {
    const id = req.user.id;
    const total = await Cart.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
        }
      },
      {
        $unwind: '$items'
      },
      {
        $project: {
          productId: '$items.productId',
          quantity: '$items.quantity',
          subTotal: '$items.subTotal',
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: 'productId',
          foreignField: '_id',
          as: 'cartItem',
        }
      },
      {
        $project: {
          productId: 1,
          quantity: 1,
          subTotal: 1,
          cartItem: { $arrayElemAt: ['$cartItem', 0] },
        }
      }
    ]);
    const quantities = [];
    const cartItems = [];
    const subTotal = [];

    for (const item of total) {
      quantities.push(item.quantity);
      cartItems.push(item.cartItem);
      subTotal.push(item.subTotal);
    }

    const totalPrice = subTotal.reduce((a, b) => a + b, 0);
    const offer = await Coupon.findOne({ couponCode: req.body.couponCode });
    const value = offer ? offer.discount : 0;
    const discount = value == 0 ? 0 : Math.round((value * totalPrice) / 100);
    const bill = totalPrice - discount;
    const orderItems = cartItems.map((item, index)  => ({
      itemId: item._id,
      name: item.bookName,
      price: item.price,
      quantity: quantities[index],
    })); 
    for (const item of orderItems) {
      const productId = item.itemId;
      const quantityPurchased = item.quantity;

      const product = await Product.findById(productId);
      if (!product || product.quantity < quantityPurchased) {
        // Product not found or not enough quantity available
        return res.render('invoice', {outOfStock: true});
      }
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { quantity: -quantityPurchased } },
        { new: true } 
      );
    }
    await Cart.updateOne({ userId: id }, { $set: { items: [] } });
    const {shippingId, paymentMethod, couponCode}  = req.body;
    const order = new Order({
      userId: id,
      addressId: shippingId,
      TotalAmt: totalPrice,
      orderItems: orderItems,
      discount: discount,
      couponCode: couponCode,
      payableTotal: bill,
      paymentStatus: paymentMethod=== "Online Payment" ? "Paid" : "Not Paid",
      paymentMethod: paymentMethod,
    });
    await order.save();

    res.redirect("/invoice");
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.invoice = async (req, res) => {
  const id = req.user.id;
  const order = await Order.find({ userId: id });
  const lastestOrder = order.at(-1)
  const orderItems = lastestOrder.orderItems;
  const orderAdrId = lastestOrder.addressId;
  const address = await Users.findOne({_id:id},
    {addresses:{$elemMatch:{_id: orderAdrId}}});
  const adr = address.addresses[0];
  const ids = orderItems.map(orderItem => orderItem.itemId)
  const products = await Product.find({ _id: { $in: ids } });
  res.render('invoice', {address:adr, orderData: lastestOrder, products: orderItems, items: products});
}