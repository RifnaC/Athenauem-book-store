const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const Product = require('../models/products');

function notification(msg) {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8">
      <title>Atheneuam - Book Colleciton</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport">
      <meta content="" name="keywords">
      <meta content="" name="description">
  
      <!-- Favicon -->
      <link href="img/book collection 0.png" rel="icon">
  
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  </head>
  <body>
  <script> 
      Swal.fire({
        imageUrl: "/img/favicon.png",
        title: "Atheneuam",
        imageWidth: 120,
        imageHeight: 80,
        imageAlt: "Atheneuam Logo",
        text: "${msg}",
        confirmButtonColor: '#15877C',
      }).then((result) => {
        history.back();
      })
  </script>
  </body>
  <!-- JavaScript Libraries -->
  
  </html>`
}

// Razorpay instance 
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

exports.checkout = async (req, res) => {
  try {
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
    res.status(200).render('checkout', { user: user, address: addres, totalPrice: totalPrice, coupon: discount, mrp: payableTotal, cart: items, CouponCode: CouponCode });
  } catch (error) {
    res.status(500).send(notification('Something went wrong, please try again later'));
  }
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
    res.status(500).send(notification('Something went wrong, please try again later'));
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
    const orderItems = cartItems.map((item, index) => ({
      itemId: item._id,
      name: item.bookName,
      price: item.price,
      quantity: quantities[index],
      orderDate: Date.now(),
    }));
    for (const item of orderItems) {
      const productId = item.itemId;
      const quantityPurchased = item.quantity;

      const product = await Product.findById(productId);
      if (!product || product.quantity < quantityPurchased) {
        // Product not found or not enough quantity available
        return res.render('invoice', { outOfStock: true });
      }
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { quantity: -quantityPurchased } },
        { new: true }
      );
    }

    const { shippingId, paymentMethod, couponCode } = req.body;
    const order = new Order({
      userId: id,
      addressId: shippingId,
      TotalAmt: totalPrice,
      orderItems: orderItems,
      discount: discount,
      couponCode: couponCode,
      payableTotal: bill,
      paymentStatus: paymentMethod === "Online Payment" ? "Paid" : "Not Paid",
      paymentMethod: paymentMethod,
    });
    await order.save().then(async () => {
      const result = await Cart.updateOne({ userId: id }, { $set: { items: [] } });
    })
    res.redirect("/invoice");
  } catch (error) {
    res.status(500).send(notification('Unable to place order, please try again later'));
  }
};

exports.verifyPayment = (req, res) => {
  let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

  const crypto = require('crypto');
  const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET).update(body.toString()).digest('hex');

  const response = { "signatureIsvalid": "false" }
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { "signatureIsvalid": "true" }
  res.send(response);

}

exports.invoice = async (req, res) => {
  try {
    const id = req.user.id;
    const order = await Order.find({ userId: id }).sort({ _id: -1 });
    const lastestOrder = order[0];
    const orderItems = lastestOrder.orderItems;
    const orderAdrId = lastestOrder.addressId;
    const address = await Users.findOne({ _id: id },
      { addresses: { $elemMatch: { _id: orderAdrId } } });
    const adr = address.addresses[0];
    const ids = orderItems.map(orderItem => orderItem.itemId)
    const products = await Product.find({ _id: { $in: ids } });
    res.render('invoice', { address: adr, orderData: lastestOrder, products: orderItems, items: products });
  } catch (error) {
    res.status(500).send(notification('Something went wrong, please try again later'));
  }
}