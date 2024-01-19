const product = require('../models/products');
const shops = require('../models/shopModel');
const cart = require('../models/cartModel');
const genre = require('../models/categoryModel')

exports.singleView= async (req, res, next) => {
    const id = req.params.id;
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
    res.render('singleProductView', {item: item, off:off, shop:shop, genre: category})
}

exports.shopPage = async (req, res, next) => {
    const search = req.query.searchQuery || "";
    const books = await product.find({$or:[{bookName:{$regex:'.*'+search+'.*'}},{author:{$regex:'.*'+search+'.*'}},{genre:{$regex:'.*'+search+'.*'}}]});
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
    const Robert = await product.find({author: 'Robert T. Kiyosaki '});
    const jay = await product.find({author: 'Jay Shetty '});
    const james = await product.find({author: 'James clear',});
    res.render('author', {robert: Robert, jay: jay, james: james})
}

exports.contact = async (req, res, next) => {
    const search = req.query.searchQuery || "";
    if (search !== "") {
        res.redirect("/shop-page");
    }
    res.render('contact')
}
