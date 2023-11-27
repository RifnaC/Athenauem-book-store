const { log } = require('handlebars');
const cart = require('../models/cartModel');
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
    const userId = req.user._id;
    const {productId, quantity} = req.body;
    try{
        const cart = await cart.findOne({userId});
        const product
        // if(cart){
        //     const product = cart.items.findIndex(item => item.productId == productId);
        //     if(product > -1){
        //         const newQuantity = cart.items[product].quantity + quantity;
        //         cart.items[product].quantity = newQuantity;
        //         cart.items[product].total = newQuantity * cart.items[product].price;
        //     }else{
}