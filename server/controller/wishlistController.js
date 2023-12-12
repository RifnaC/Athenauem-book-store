const { log } = require('handlebars');
const Wishlist = require('../models/wishlistModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');

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
            wishlist.save();
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

exports.deleteWishlistItem = async (req, res) => {
        const { wishlistId, productId } = req.body;
        try{
            await Wishlist.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(wishlistId) },
                { $pull: { 'items': { productId: productId } } }
            ).then(() => {
                res.json({ success: true });
            })
        }catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

// exports.changeQuantity = async (req, res) => {
//     let {cartId, productId, count, subTotal} = req.body;
//     count = Number(count);
//     subTotal = Number(subTotal)
    
    
//     await Cart.findOneAndUpdate(
//         {_id: new mongoose.Types.ObjectId(cartId),'items.productId':productId}, 
//         {$inc: {'items.$.quantity': count, 'items.$.subTotal': subTotal}}
//     ).then(() => {
//         res.redirect('/cart');
//     }) 
// }




// exports.getPlaceOrder = async (req, res) => {
//     let userId = req.user.id;
//     const total = await Cart.aggregate([
//         {
//             $match: { 
//                 userId: new mongoose.Types.ObjectId(userId),
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
//     ])
//     // console.log(total[0].totalPrice);
//     const totalPrice = total[0].totalPrice;
//     console.log(totalPrice);
//     res.render('cart',{totalPrice});
// }
// }

