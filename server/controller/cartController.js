const { log } = require('handlebars');
const Cart = require('../models/cartModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');

exports.addToCart = async(req, res) => {
    const userId = req.user.id; 
    const productId = req.params.id;
    const  quantity = req.body.quantity;
    const price = await Books.find({_id: new mongoose.Types.ObjectId(productId)},{price:1, _id:0});
    const subTotal = price[0].price;

    try {
        const cart = await Cart.findOne({ userId });
        if(!cart){
            const cart = new Cart({
                userId,
                items: [{ productId, quantity, subTotal}],
                totalPrice: 0,
            });
            await cart.save()
        }else{
            const productExist = cart.items.findIndex(items => items.productId == productId);
            if(productExist !== -1){
                await Cart.findOneAndUpdate(
                    {'userId': userId, 'items.productId':productId}, 
                    {$inc: {'items.$.quantity': 1, 'items.$.subTotal': subTotal}}
                )
            }else{
                const updateCart = await Cart.findOneAndUpdate({ userId }, {
                    $push:{items: {productId: productId, quantity: quantity, subTotal: subTotal}},
                })
                await updateCart.save()
            }
        }         
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


exports.updateCart = async (req, res) => {
    const cart = await Cart.findOne({userId: req.user.id});
    const cartId = cart._id;
    const productId = req.body.productId;
    const count = Number(req.body.quantity);
    const book = await Books.find({_id: productId});
    const price = book[0].price;
    const subTotal = price * count;
    await Cart.findOneAndUpdate(
        {_id: cartId,'items.productId':productId}, 
        { $inc: {'items.$.quantity': count, 'items.$.subTotal': subTotal},}
    )
    await Cart.updateMany(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $pull: { items: { quantity: { $lt: 1 } } } },
    );

    // Send a response back to the client
    res.json({ success: true });
}
exports.cartView = async (req, res) => {
    const userId = req.user.id; 
    const search = req.query.searchQuery || '';
    if (search !== ""){
        res.redirect('/shop-page');
    }
    const cartItems = await Cart.aggregate([
        {
            $match: { 
                userId: new mongoose.Types.ObjectId(userId),
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
    ]);
    
    cartItems.forEach(cartItem => {
        cartItem.totalPrice = cartItem.subTotal
    })
    cartItems.totalPrice = cartItems.reduce((total, item) => total + item.subTotal, 0);
    let emptyCart = false;
    if(cartItems.length === 0){
        emptyCart = true;
    }
    res.render('cart', {cartItems, emptyCart});
}

exports.changeQuantity = async (req, res) => {
    let {cartId, productId, count, subTotal} = req.body;
    count = Number(count);
    subTotal = Number(subTotal)
    await Cart.findOneAndUpdate(
        {_id: new mongoose.Types.ObjectId(cartId),
            'items.productId':productId,
            'items.quantity': { $lt: 10 }
        }, 
        {
            $inc: {'items.$.quantity': count, 'items.$.subTotal': subTotal}
        }
    )
    await Cart.updateMany(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $pull: { items: { quantity: { $lt: 1 } } } },
      );
    res.redirect('/cart')
};

exports.deleteCartItem = async (req, res) => {
    const { cartId, productId } = req.body;
    try{
        await Cart.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(cartId) },
            { $pull: { 'items': { productId: productId } } }
        ).then(() => {
            res.json({ success: true });
        })
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


