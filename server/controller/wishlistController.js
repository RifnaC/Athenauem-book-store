const { log } = require('handlebars');
const Wishlist = require('../models/wishlistModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');

function notification(msg) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <title>Atheneuam - Book Colleciton</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">
    
        <!-- Favicon -->
        <link href="img/book collection 0.png" rel="icon">
    
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body>
    <script> 
        Swal.fire({
            imageUrl: "/img/favicon.png",
            title: "Atheneuam",        
            imageWidth: 120,
            imageHeight: 80,
            imageAlt: "Atheneuam Logo",
            text: "${msg}",   
            confirmButtonText: 'Ok',     
            confirmButtonColor: '#15877C',
        });
    </script>
    </body>
    <!-- JavaScript Libraries -->
    </html>`
}

// add to wishlist 
exports.addToWishlist = async(req, res) => {
    const userId = req.user.id; 
    const productId = req.params.id;
    const price = await Books.find({_id: new mongoose.Types.ObjectId(productId)},{price:1, _id:0});
    try {
        const wishlist = await Wishlist.findOne({ userId });
        if(!wishlist){
            const wishlist = new Wishlist({
                userId,
                items: [{productId}],
            });
            wishlist.save()
        }else{
            const productExist = wishlist.items.findIndex(items => items.productId == productId);
            if(productExist === -1){
                const updateWishlist = await Wishlist.findOneAndUpdate({ userId }, {
                    $push:{items: {productId: productId,}},
                })
                updateWishlist.save();
            }
        }    
        res.redirect('back');     
    } catch (error) {
        console.error(error);
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}

// view wishlist
exports.wishlist = async(req, res) => {
   try {
    const userId = req.user.id; 
    const cartCount = await Cart.findOne({userId: req.user.id});
    const search = req.query.searchQuery || "";
    
        
    if(search !== ""){
        res.redirect('/shop-page')
    }
    const wishlistItems = await Wishlist.aggregate([
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
            }
        },
        {  
            $lookup:{
                from: 'books',
                localField: 'productId',
                foreignField: '_id',
                as: 'wishlistItem',
            }
        },
        {
            $project: {
                productId: 1,
                wishlistItem: { $arrayElemAt: ['$wishlistItem', 0] },
            }
        },
    ]);
    
    const cartItems = cartCount ? cartCount.items : null;
    if(cartItems){
        wishlistItems.forEach(item => {
            const cartItem = cartItems.find(prdt => prdt.productId.toString() === item.wishlistItem._id.toString());
            if (cartItem) {
                item.wishlistItem.inCart = true;
                item.wishlistItem.cartQty = cartItem.quantity;
            }else{
                item.wishlistItem.inCart = false;
            }
        })
    }
    let emptyWishlist = false;
    if(wishlistItems.length === 0){
        emptyWishlist = true;
    }
    if(cartCount !== null){
        res.render('wishlist', {wishlistItems, emptyWishlist: emptyWishlist});
    }
    res.render('wishlist', {wishlistItems, emptyWishlist: emptyWishlist});
   } catch (error) {
    res.status(500).send(notification('Something went wrong, please try again later'));
   }
}

// delete wishlist item
exports.deleteWishlistItem = async (req, res) => {
    try{
        const { wishlistId, productId } = req.body;
        const wishlist = await Wishlist.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(wishlistId) },
            { $pull: { 'items': { productId: productId } } }
        );
        wishlist.save().then(() => {
            res.json({ success: true });
        });
    }catch (error) {
        console.error(error);
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}
// add all items to cart
exports.addAllToCart = async(req, res) => {
    const userId = req.user.id;
    try {
        const wishlist = await Wishlist.findOne({ userId });
        if (wishlist) {
            const productIds = wishlist.items.map(item => item.productId);
            const products = await Books.find({ _id: { $in: productIds },
                $and: [{
                    stock: {
                        $ne: 'Out Of Stock'
                    },
                    $or: [{
                        quantity: { $gt: 0 }
                    }]
                }]
            });
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                const newCart = new Cart({
                    userId,
                    items: products.map(product => ({
                        productId: product._id,
                        quantity: 1, 
                        subTotal: product.price,
                    })),
                });
                await newCart.save();
            } else {
                for (const product of products) {
                    const productExist = cart.items.findIndex(item => item.productId.equals(product._id));
                    if (productExist === -1) {
                        cart.items.push({   
                            productId: product._id,
                            quantity: 1, 
                            subTotal: product.price,
                        });
                    }
                } 
                await cart.save();
            }
            wishlist.items = [];
            await wishlist.save();
            res.status(200).render('wishlist');
            } else {
                res.status(404).send(notification('Wishlist not found'));
            }
        } catch (error) {
          console.error(error);
          res.status(500).send(notification('Something went wrong, please try again later'));
        }
}

// delete all items from the wishlist
exports.clearWishlist = async (req, res) => {
    const userId = req.user.id;
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (wishlist) {
        wishlist.items = [];
        await wishlist.save();
  
        res.status(200).render('wishlist');
      } else {
        res.status(404).send(notification('Sorry, no wishlist found'))
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(notification('Something went wrong , please try again later'));
    }
};
  


