const product = require('../models/products');
const shops = require('../models/shopModel');
const cart = require('../models/cartModel');

exports.singleView= async (req, res, next) => {
    const id = req.params.id
    const item = await product.findById(id);
    const genre = item.genre;
    const category = await product.find({genre: genre}); 
    const vendorId = item.shopId;
    const shop = await shops.findById(vendorId);
    const off =  Math.floor((item.discount * 100) / item.originalPrice)
    res.render('singleProductView', {item: item, off:off, shop:shop, genre: category})
}

exports.shopPage = async (req, res, next) => {
    const books = await product.find({});
    res.render('shop-page', {books: books})    
}

// exports.changeQuantity = async (req, res) => {
//     let { productId, count, subTotal} = req.body;
//     count = Number(count);
//     subTotal = Number(subTotal)
//     await Cart.findOneAndUpdate(
//         {_id: new mongoose.Types.ObjectId(cartId),'items.productId':productId}, 
//         {
//             $inc: {'items.$.quantity': count, 'items.$.subTotal': subTotal}
//         }
//     )
//     await Cart.updateMany(
//         { _id: new mongoose.Types.ObjectId(cartId) },
//         { $pull: { items: { quantity: { $lt: 1 } } } },
//       );
//     res.redirect('/cart')
// };
