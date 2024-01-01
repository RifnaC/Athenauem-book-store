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
                totalPrice:{
                    $sum: '$subTotal'
                },
            }
        }
    ]);
    const totalPrice = total[0].totalPrice;
    const offer = await Coupon.findOne({couponCode: req.query.couponCode});
    const value = offer ? offer.discount : 0;
    const discount = Math.round((value * totalPrice) / 100);
    const payableTotal =  totalPrice - discount;
    res.render('checkout', {user: user, address: addres, totalPrice:totalPrice, coupon: discount, mrp: payableTotal});
}


// exports.changeAddress = async(req, res) => {
//     const id=req.params.id;
//     const userId = req.user.id;
//     const existingAddress = await Users.findOne({_id: userId,
//         'addresses': {
//             $elemMatch: {
//                 fullName: req.body.fullName,
//                 phone: req.body.phone,
//                 address: req.body.address,
//                 city: req.body.city,
//                 district: req.body.district,
//                 state: req.body.state,
//                 pincode: req.body.pincode,
//                 _id:id
//             }
//         }
//     });
    
//     if(!existingAddress) {
//         const user = await Users.findByIdAndUpdate({_id:userId}, 
//             {$push:{   
//                 "addresses": {
//                     fullName:req.body.fullName,
//                     phone:req.body.phone,
//                     address:req.body.address,
//                     city:req.body.city,
//                     district:req.body.district,
//                     state:req.body.state,
//                     pincode:req.body.pincode,
//                 }
//             }
//         },
//         { new: true });
//     }
//     const updatedUser = await Users.aggregate([
//         {
//           "$unwind": "$addresses" 
//         },
//         {
//           "$match": {
//             "addresses._id": new mongoose.Types.ObjectId(id)
//           }
//         },
//         {
//           "$project": {
//             "addresses": 1,
//           }
//         }
//       ])

//     const selectedAdr = updatedUser[0].addresses;
//     const name=selectedAdr.fullName;
//     const adr=selectedAdr.address;
//     const city = selectedAdr.city;
//     const district=selectedAdr.district;
//     const state=selectedAdr.state;
//     const pin=selectedAdr.pincode;
//     console.log(name, adr, city, district, state, pin);
//     res.render('checkout', {updatedAdr: "true", name, adr, city, district, state, pin});
// }


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
  
// exports.getOrder = async(req, res) => {
//     const id = req.user.id;
//     // const {couponCode,totalAmt, discount, mrp} =req.body;
//     const orders = await Order.findOne({userId: id});
//     const total = await Cart.aggregate([
//         {
//             $match: { 
//                 userId: new mongoose.Types.ObjectId(id),
//             }
//         },
//         {
//             $unwind: '$items'
//         },
//         {
//             $project: {
//                 productId: '$items.productId',
//                 quantity: '$items.quantity',
//                 subTotal: '$items.subTotal',
//             }
//         },
//         {  
//             $lookup:{
//                 from: 'books',
//                 localField: 'productId',
//                 foreignField: '_id',
//                 as: 'cartItem',
//             }
//         },
//         {
//             $project: {
//                 productId: 1,
//                 quantity: 1,
//                 subTotal: 1,
//                 cartItem: { $arrayElemAt: ['$cartItem', 0] },
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalPrice:{
//                     $sum: '$subTotal'
//                 },
//             }
//         }
//     ]);
//     const totalPrice = total[0].totalPrice;
//     const offer = await Coupon.findOne({couponCode: req.query.couponCode});
//     const value = offer ? offer.discount : 0;
//     const discount = Math.round((value * totalPrice) / 100);
//     const order = new Order({
//         userId: id,
//         couponCode:req.query.couponCode,
//         totalAmt:totalPrice,
//         discount: discount,
//         payableTotal:totalPrice - discount
//     });
//     order.save().then(()=> {
//         res.render('checkout');
//     })
    
// }

// exports.proceedToPayment = async (req, res) => {
//     const id = req.user.id;

// };