const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');

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


exports.changeAddress = async(req, res) => {
    const id = req.user.id;
    const existingAddress = await Users.findOne({_id: id,
        'addresses': {
            $elemMatch: {
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode,
            }
        }});
        if(!existingAddress) {
            const user = await Users.findByIdAndUpdate({_id:id}, {$push:{   
                "addresses": {
                fullName:req.body.fullName,
                phone:req.body.phone,
                address:req.body.address,
                city:req.body.city,
                district:req.body.district,
                state:req.body.state,
                pincode:req.body.pincode,
            }
        }});
        user.save();
    }
    res.render('checkout');
}
