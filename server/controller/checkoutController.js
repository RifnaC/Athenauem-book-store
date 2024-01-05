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
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            district: req.body.district,
            state: req.body.state,
            pincode: req.body.pincode,
            _id: id
          }
        }
    });
    if (!existingAddress) {
      const user = await Users.findByIdAndUpdate(
        { _id: userId },
        {
            $push: {
              "addresses": {
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode,
              }
            }
        }
      );
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

    const selectedAdr = updatedUser[0].addresses;
    const addressId = selectedAdr._id;
    const name = selectedAdr.fullName;
    const adr = selectedAdr.address;
    const city = selectedAdr.city;
    const district = selectedAdr.district;
    const state = selectedAdr.state;
    const pin = selectedAdr.pincode;
    res.render("checkout");
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
    
    // for (const item of total) {
    //   const productId = item.productId;
    //   const quantity = item.quantity;
    //   const cartItem = item.cartItem;
    // }

const quantities = [];
const cartItems = []
const subTotal = [];

for (const item of total) {
  quantities.push(item.quantity);
  cartItems.push(item.cartItem);
  subTotal.push(item.subTotal);
}

    const totalPrice = subTotal.reduce((a, b) => a + b, 0);
    console.log(cartItems);
    const offer = await Coupon.findOne({couponCode: req.query.couponCode});
    console.log(offer)
    const value = offer ? offer.discount : 0;
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