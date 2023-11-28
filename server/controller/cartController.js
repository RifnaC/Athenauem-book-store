const { log } = require('handlebars');
const Cart = require('../models/cartModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');



// exports.cartView = async(req, res) => {
//     const userId  = req.user._id;
//     try{
//         const  cart = await cart.findOne({userId});
//         if(cart && cart.items.length > 0){
//             res.status(200).send(cart);
//         }else{
//             res.send(null);
//         }
//     }
//     catch (error){
//         res.status(500).send(error);
//     }
// }

// exports. = async(req, res) => {
//     const productId = req.params.id;
//     // const product = await product.find();
//     const userId = req.user.id;
//     console.log(userId + " " + productId);
//     try {
//         const product = await product.findById(productId);
//         if(!product){
//             return res.status(404).send('Product not found');
//         }

//         let cart = await Cart.findOne({ userId });
//         if (!cart) {
//             cart = new Cart({ userId });
//           }
//           cart.items.push({ item: product._id });

//           // Update the total price
//           cart.totalPrice += product.price;
      
//           // Save the cart to the database
//           const sd=await cart.save();
//           console.log(sd);

//           res.redirect('/cart');
//     } catch (error) {
//         console.error(error);
//           res.status(500).send('Internal Server Error');
//         }
// }


exports.addToCart = async(req, res) => {
    const userId = req.user.id; 
    const productId = req.params.id;
    try {
        const cart = await Cart.findOne({ userId });
        if(!cart){
            const cart = new Cart({
                userId,
                items: [{ productId }],
                totalPrice: 0,
            });
            cart.save().then (() => {
                res.redirect('/cart');
            })
        }
        const updateCart = await Cart.findOneAndUpdate({ userId }, {
                $push:{items: {productId: productId}}
        
            });
            updateCart.save().then(() => {
                res.redirect('/cart');
            })

       
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
    console.log("cartItems" , cartItems[0].cartItems);
    res.render('cart');
}