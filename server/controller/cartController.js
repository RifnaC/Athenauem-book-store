const { log } = require('handlebars');
const Cart = require('../models/cartModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');

exports.addToCart = async(req, res) => {
    const userId = req.user.id; 
    const productId = req.params.id;
    const {quantity, subTotal} = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if(!cart){
            const cart = new Cart({
                userId,
                items: [{ productId, quantity, subTotal }],
                totalPrice: 0,
            });
            cart.save().then (() => {
                res.redirect('/cart');
            })
        }else{
            const productExist = cart.items.findIndex(items => items.productId == productId);
            if(productExist !== -1){
                const incQty = cart.updateOne({'items.productId': productId}, {
                    $inc: { 'items.$.quantity': 1, 'items.$.subTotal': subTotal}
                })
                console.log(incQty);
            }
        }        
        // const updateCart = await Cart.findOneAndUpdate({ userId }, {
            //     $push:{items: {productId: productId, quantity: quantity, subTotal: subTotal}},
            // });
            // updateCart.save().then(() => {
            //     res.redirect('/cart');
            // });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


exports.cartView = async (req, res) => {
    const userId = req.user.id; 
    // console.log("userId", userId, );
    const cartItems = await Cart.aggregate([
        {
            $match: { 
                userId: new mongoose.Types.ObjectId(userId),
            }
        },
        {  
            $lookup:{
                from: 'books',
                localField: 'items.productId',
                foreignField: '_id',
                as: 'cartItems',
                let:{items:'$items.productId'},
                pipeline: [{
                    $match: {
                        $expr:{
                            $in:['$_id', '$$items'] 
                        }
                    }      
                }]
            }
        }
    ]);
    // console.log("cartItems" , cartItems[0].cartItems);
    res.render('cart', {cartItems});
}