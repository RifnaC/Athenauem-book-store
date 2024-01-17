const product = require('../models/products');
const shops = require('../models/shopModel');
const cart = require('../models/cartModel');
const genre = require('../models/categoryModel')

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
    const category = await genre.find({});
    res.render('shop-page', {books: books, genre: category})    
}

exports.category = async (req, res, next) => {
    const fiction = await product.find({genre: "Fiction"});
    const biography = await product.find({genre: "Biography"});
    const novels = await product.find({genre: "Novels"});
    const horror = await product.find({genre: "Horror"});
    const science = await product.find({genre: "Science Fiction"});
    const selfhelp = await product.find({genre: "self-help"});

    res.render('categories', {fiction: fiction, biography:biography, novels:novels, horror:horror, science: science, selfhelp: selfhelp})   
}


exports.author = async (req, res, next) => {
    const Robert = await product.find({author: "Robert T. Kiyosaki" });
    console.log(Robert)
    res.render('author', {authors: Robert})
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
