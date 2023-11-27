const { log } = require('handlebars');
const Cart = require('../models/cartModel');
const product = require('../models/products');
const { category } = require('../services/render');
const path = require('path')

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

exports.addToCart = async(req, res) => {
    const productId = req.params.id;
    // const product = await product.find();
    const userId = req.user.id;
    console.log(userId + " " + productId);
    try {
        const product = await product.findById(productId);
        if(!product){
            return res.status(404).send('Product not found');
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId });
          }
          cart.items.push({ item: product._id });

          // Update the total price
          cart.totalPrice += product.price;
      
          // Save the cart to the database
          await cart.save();

          res.redirect('/cart');
    } catch (error) {
        console.error(error);
          res.status(500).send('Internal Server Error');
        }
}


exports.cartView = async(req, res) => {
    const userId = req.user.id; // Adjust this based on your authentication logic
        console.log(userId);
    try {
        // Find the user's cart (assuming you have user authentication)
        
        const cart = await Cart.findOne({ userId }).populate('items.item');
    
        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

