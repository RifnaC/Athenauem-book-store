const product = require('../models/products');
const shops = require('../models/shopModel');
const cart = require('../models/cartModel');
const genre = require('../models/categoryModel')


exports.productView = async (req, res) => {
  try {
      const id = req.params.id;
      const cartCount = await cart.findOne({userId: req.user.id});
      const search = req.query.searchQuery || "";
      if(search !== ""){
          res.redirect('/shop-page')
      }
      const item = await product.findById(id);
      const genre = item.genre;
      const category = await product.find({genre: genre}); 
      const vendorId = item.shopId;
      const shop = await shops.findById(vendorId);
      const off =  Math.floor((item.discount * 100) / item.originalPrice)
      res.render('singleProductView', {item: item, off:off, shop:shop, genre: category, length: cartCount.items.length, cartId: cartCount._id})
  }catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}
exports.shopPage = async (req, res, next) => {
    const cartCount = await cart.findOne({userId: req.user.id});
    const search = req.query.searchQuery || "";
    const limit = 9;
    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }
    const skip = (page - 1) * limit;
    const books = await product.find({
      $or:[
        {bookName:{$regex:'.*'+search+'.*'}},
        {author:{$regex:'.*'+search+'.*'}},
        {genre:{$regex:'.*'+search+'.*'}}
      ]
    }).limit(limit).skip(skip).exec();
    
    const count = await product.find({
      $or:[
        {bookName:{$regex:'.*'+search+'.*'}},
        {author:{$regex:'.*'+search+'.*'}},
        {genre:{$regex:'.*'+search+'.*'}}
      ]}).countDocuments();
      const totalPages = Math.ceil(count / limit);
      const pages = Array.from({ length: totalPages }, (e, index) => index + 1);
      console.log(pages);
    const category = await genre.find({});
    res.render('shop-page', {pages, currentPage: page, books: books, genre: category, length: cartCount.items.length, cartId: cartCount._id})    
}

exports.category = async (req, res, next) => {
    const search = req.query.searchQuery || "";
    const cartCount = await cart.findOne({userId: req.user.id});
    const fiction = await product.find({genre: "Fiction",  $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    const biography = await product.find({genre: "Biography",  $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    const novels = await product.find({genre: "Novels",  $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    const horror = await product.find({genre: "Horror",  $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    const science = await product.find({genre: "Science Fiction",  $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    const selfhelp = await product.find({genre: "self-help",  $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    res.render('categories', {fiction: fiction, biography:biography, novels:novels, horror:horror, science: science, selfhelp: selfhelp, length: cartCount.items.length, cartId: cartCount._id})   
}

exports.author = async (req, res, next) => {
    const search = req.query.searchQuery || "";
    const cartCount = await cart.findOne({userId: req.user.id});
    const Robert = await product.find({author: 'Robert T. Kiyosaki ', $or:[
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
    ]});
    const jay = await product.find({author: 'Jay Shetty ', $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    const james = await product.find({author: 'James clear', $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]});
    res.render('author', {robert: Robert, jay: jay, james: james, length:cartCount.items.length, cartId: cartCount._id})
}

exports.contact = async (req, res, next) => {
    const search = req.query.searchQuery || "";
    if (search !== "") {
        res.redirect("/shop-page");
    }
    res.render('contact')
}
