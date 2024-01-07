const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');

exports.checkout = async(req, res) => {
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
            $lookup:{
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
                cartItem: {$push: '$cartItem'},
                totalPrice:{
                    $sum: '$subTotal'
                },
            }
        }
    ]);
    console.log(total[0].quantity);
    const items = total[0].cartItem;
    const totalPrice = total[0].totalPrice;
    const offer = await Coupon.findOne({couponCode: req.query.couponCode});
    const value = offer ? offer.discount : 0;
    const discount = Math.round((value * totalPrice) / 100);
    const payableTotal =  totalPrice - discount;
    res.render('checkout', {user: user, address: addres, totalPrice:totalPrice, coupon: discount, mrp: payableTotal, cart:items,});
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

    // res.render("checkout", { updatedAddress: updatedUser[0].addresses });
  } catch (error) {      
    console.error(error);
    res.status(500).send('Internal Server Error');
  }  
}
  
exports.getOrder = async(req, res) => {
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
            $lookup:{
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
const cartItems = []
const subTotal = [];

for (const item of total) {
  quantities.push(item.quantity);
  cartItems.push(item.cartItem);
  subTotal.push(item.subTotal);
}

    const totalPrice = subTotal.reduce((a, b) => a + b, 0);
    console.log(cartItems.price);
    const offer = await Coupon.findOne({couponCode: req.query.couponCode});
    console.log(offer)
    const value = offer ? offer.discount : 0;
    console.log(value)
    const discount = value==0 ? 0 : Math.round((value * totalPrice) / 100);
    const bill = totalPrice - discount;
    const orderItems = cartItems.map((item, index)  => ({
      itemId: item._id,
      name:item.bookName,
      price: item.price,
      quantity: quantities[index],
    })
    );
    
    const order = new Order({
      userId: new mongoose.Types.ObjectId(id),
      addressId: new mongoose.Types.ObjectId(req.body.savedId),
      TotalAmt:totalPrice,
      orderItems:orderItems,
      discount:discount,
      couponCode: req.query.couponCode,
      payableTotal:bill,
      paymentMethod:req.body.paymentMethod,
    });
    order.save().then(()=> {
          res.render('checkout');
      })
    // const order = new Order({
      
    //   // orderItems:{
    //   //   itemId: 
    //   //   quantity:
    //   //   price:
    //   // }
    //   TotalAmt:totalPrice,
    //   discount:discount?,
    //   couponCode: req.query.couponCode,
    //   payableTotal:totalPrice - discount,
    //   paymentMethod:req.body.paymentMethod,
    // });
    //
    
}

// exports.proceedToPayment = async (req, res) => {
//     const id = req.user.id;

// };