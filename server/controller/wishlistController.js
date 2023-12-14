const { log } = require('handlebars');
const Wishlist = require('../models/wishlistModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');

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
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
// view wishlist
exports.wishlist = async(req, res) => {
    const userId = req.user.id; 
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
    res.render('wishlist', {wishlistItems});
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
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
// add all items to cart
exports.addAllToCart = async(req, res) => {
    const userId = req.user.id;
        try {
            const wishlist = await Wishlist.findOne({ userId });
            if (wishlist) {
                const productIds = wishlist.items.map(item => item.productId);
                const products = await Books.find({ _id: { $in: productIds } });
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
                res.status(404).json({ error: 'Wishlist not found' });
        }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
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
        res.status(404).json({success: false});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false});
    }
};
  


