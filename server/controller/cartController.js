const { log } = require('handlebars');
const Cart = require('../models/cartModel');
const product = require('../models/products');
const { category } = require('../services/render');
const path = require('path')

exports.cartView = async(req, res) => {
    const userId  = req.user._id;
    try{
        const  cart = await cart.findOne({userId});
        if(cart && cart.items.length > 0){
            res.status(200).send(cart);
        }else{
            res.send(null);
        }
    }
    catch (error){
        res.status(500).send(error);
    }
}

exports.addToCart = async(req, res) => {
    // const userId = req.user._id;
    // const {productId, quantity} = req.body;
    // try{
    //     const cart = await cart.findOne({userId});
    //     const product = await product.findOne({_id: productId});
    //     if(!product){
    //         res.status(404).send('Product not found');
    //         return;
    //     }
    //     const price = product.price;
    //     const name = product.bookName;

    //     if(cart){
    //         const productIndex = cart.items.findIndex((item) => item.productId == productId);
    //         if(productIndex > -1){
    //             let product = cart.items[productIndex];
    //                 product.quantity += quantity;
    //                 cart.bill = cart.items.reduce((acc, curr) =>{
    //                     return acc + curr.quantity * curr.price;
    //                 }, 0);
    //             }
    //         }
    //     }
       
    // }catch(err){
    // }
    try {
        const cart = new Cart({
            productId: req.body.productId,
            quantity: req.body.quantity,
            price: req.body.price,
            shopId: req.body.shopId
        })
        const savedCart = await cart.save();   
        res.status(200).send({msg:"Cart saved successfully", data:savedCart})
        
    } catch (error) {
        res.status(400).send({
            success: false, msg: error.message
        })
        
    }
}