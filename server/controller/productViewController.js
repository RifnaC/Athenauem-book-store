const product = require('../models/products');
const shops = require('../models/shopModel');
const cart = require('../models/cartModel');
const genre = require('../models/categoryModel')


exports.productView = async (req, res) => {
  try {
    const id = req.params.id;
    const cartCount = await cart.findOne({ userId: req.user.id });
    const search = req.query.searchQuery || "";
    if (search !== "") {
      res.redirect('/shop-page')
    }
    const item = await product.findById(id);
    const genre = item.genre;
    const category = await product.find({ genre: genre });
    const vendorId = item.shopId;
    const shop = await shops.findById(vendorId);
    const off = Math.floor((item.discount * 100) / item.originalPrice)

    if(cartCount !== null){
      const length =  cartCount.items.length;
      const  cartId = cartCount._id
      res.render('singleProductView', { item: item, off: off, shop: shop, genre: category, length:length, cartId: cartId });
    }else{
      res.render('singleProductView', { item: item, off: off, shop: shop, genre: category, length:0});
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}
exports.shopPage = async (req, res, next) => {
  const cartCount = await cart.findOne({ userId: req.user.id });
  const category = await genre.find({});
  let length = 0;
  let cartId = null;
  if(cartCount !== null){
      length =  cartCount.items.length;
      cartId = cartCount._id
      return length, cartId;
  }
  const selectedGenre = req.query.genre;
  const selectedAuthor = req.query.author;
  const search = req.query.searchQuery || "";
  const limit = 9;
  let page = 1;

  if (req.query.page) {
    page = Number(req.query.page);
  }

  const skip = (page - 1) * limit;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const query = {
    $or: [
      { bookName: { $regex: '.*' + search + '.*', $options: 'i' } },
      { author: { $regex: '.*' + search + '.*', $options: 'i' } },
      { genre: { $regex: '.*' + search + '.*', $options: 'i' } },
      { price: { $gte: minPrice, $lte: maxPrice } },
    ]
  };
  if (selectedGenre) {
    query.genre = selectedGenre;
  }
  if (selectedAuthor) {
    query.author = selectedAuthor;
  }

  const count = await product.find(query).countDocuments();
  const totalPages = Math.ceil(count / limit);
  const pages = Array.from({ length: totalPages }, (e, index) => index + 1);
  let prev;
  if (pages > 1) {
    prev = page - 1
  } else {
    prev = 1
  }

  let nxt = page + 1;
  if (nxt > pages.length) {
    nxt = pages.length;
  }
  if (selectedGenre) {
    query.genre = { $regex: '.*' + selectedGenre + '.*', $options: 'i' };
  }

  if (selectedAuthor) {
    query.author = { $regex: '.*' + selectedAuthor + '.*', $options: 'i' };
  }

  const books = await product.find(query).limit(limit).skip(skip).exec();
  const authors =[...new Set(books.map(author => author.author))];
  let availibility;
  if(books.stock === "Out Of Stock"){
    availibility = true;
  }
  res.render('shop-page', { pages, currentPage: page, prev: prev, next: nxt, books: books, genre: category, length:length, cartId: cartId, authors: authors, availibility: availibility });
}

exports.shopPageFilter = async (req, res, next) => {
  const selectedGenres = req.body.genres;
  const selectedAuthors = req.body.authors;
  const minPrice = req.body.minPrice;
  const maxPrice = req.body.maxPrice;
  const query = {
    $and:[{
      $or: [
        { genre: { $in: selectedGenres } },
        { author: { $in: selectedAuthors } },
      ],
    },
    { price: { $gte: minPrice, $lte: maxPrice } },]
  };
  const filteredBooks = await product.find(query).sort({price: 1}).exec();
  res.json(filteredBooks);

}

exports.category = async (req, res, next) => {
  const search = req.query.searchQuery || "";
  const cartCount = await cart.findOne({ userId: req.user.id });
  let length = 0;
  let cartId = null;
  if(cartCount !== null){
      length =  cartCount.items.length;
      cartId = cartCount._id
      return length, cartId;
  }
  const fiction = await product.find({
    genre: "Fiction", $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const biography = await product.find({
    genre: "Biography", $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const novels = await product.find({
    genre: "Novels", $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const horror = await product.find({
    genre: "Horror", $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const science = await product.find({
    genre: "Science Fiction", $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const selfhelp = await product.find({
    genre: "self-help", $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  res.render('categories', { fiction: fiction, biography: biography, novels: novels, horror: horror, science: science, selfhelp: selfhelp, length: length, cartId: cartId });
}

exports.author = async (req, res, next) => {
  const search = req.query.searchQuery || "";
  const cartCount = await cart.findOne({ userId: req.user.id });
  let length = 0;
  let cartId = null;
  if(cartCount !== null){
      length =  cartCount.items.length;
      cartId = cartCount._id
      return length, cartId;
  }
  const Robert = await product.find({
    author: 'Robert T. Kiyosaki ', $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const jay = await product.find({
    author: 'Jay Shetty ', $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  const james = await product.find({
    author: 'James clear', $or: [
      { bookName: { $regex: new RegExp(search, 'i') } },
      { author: { $regex: new RegExp(search, 'i') } },
      { genre: { $regex: new RegExp(search, 'i') } }
    ]
  });
  res.render('author', { robert: Robert, jay: jay, james: james, length: length, cartId: cartId });
}

exports.contact = async (req, res, next) => {
  const search = req.query.searchQuery || "";
  if (search !== "") {
    res.redirect("/shop-page");
  }
  res.render('contact')
}
