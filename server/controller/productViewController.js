const product = require('../models/products');
const shops = require('../models/shopModel');
const cart = require('../models/cartModel');
const genre = require('../models/categoryModel')

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
      <link href="img/favicon.png" rel="icon">
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
          confirmButtonColor: '#15877C',
        }).then((result) => {
          history.back();
        });
      </script>
    </body>
  <!-- JavaScript Libraries --> 
  </html>`
}

exports.productView = async (req, res) => {
  try {
    const id = req.params.id;
    const cartCount = !req.user ? 0 : await cart.findOne({ userId: req.user.id });
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
    const cartItems = cartCount ? cartCount.items : null;

    if (cartItems) {
      const cartItem = cartItems.find(prdt => prdt.productId.toString() === item._id.toString());
      item.inCart = true;
      item.cartQty = cartItems.quantity;

    } else {
      item.inCart = false;
    }

    category.forEach(book => {
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === book._id.toString());
        if (cartItem) {
          book.inCart = true;
          book.cartQty = cartItem.quantity;
        } else {
          book.inCart = false;
        }
      }
    });
    if (cartCount !== null) {
      const cartId = cartCount._id
      res.render('singleProductView', { item: item, off: off, shop: shop, genre: category, cartId: cartId });
    } else {
      res.render('singleProductView', { item: item, off: off, shop: shop, genre: category, });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send(notification('Oops, Something went wrong, please try again later'));
  }
}
exports.shopPage = async (req, res, next) => {
  try {
    const cartCount = !req.user ? 0 : await cart.findOne({ userId: req.user.id });
    const category = await genre.find({});
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
    const cartItems = cartCount ? cartCount.items : null;
    books.forEach(book => {
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === book._id.toString());
        if (cartItem) {
          book.inCart = true;
          book.cartQty = cartItem.quantity;
        } else {
          book.inCart = false;
        }
      }
    });
    const authors = [...new Set(books.map(author => author.author))];
    let availibility;
    if (books.stock === "Out Of Stock") {
      availibility = true;
    }
    if (cartCount !== null) {
      const cartId = cartCount._id
      res.render('shop-page', { pages, currentPage: page, prev: prev, next: nxt, books: books, genre: category, cartId: cartId, authors: authors, availibility: availibility });
    } else {
      res.render('shop-page', { pages, currentPage: page, prev: prev, next: nxt, books: books, genre: category, authors: authors, availibility: availibility });
    }
  } catch (error) {
    res.status(500).send(notification('Oops, Something went wrong, please try again later'));
  }

}

exports.shopPageFilter = async (req, res, next) => {
  try {
    const selectedGenres = req.body.genres;
    const selectedAuthors = req.body.authors;
    const minPrice = req.body.minPrice;
    const maxPrice = req.body.maxPrice;
    const query = {
      $and: [{
        $or: [
          { genre: { $in: selectedGenres } },
          { author: { $in: selectedAuthors } },
        ],
      },
      { price: { $gte: minPrice, $lte: maxPrice } },]
    };
    const filteredBooks = await product.find(query).sort({ price: 1 }).exec();
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).send(notification('Oops, Something went wrong, please try again later'));
  }

}

exports.category = async (req, res, next) => {
  try {
    const search = req.query.searchQuery || "";
    const cartCount = !req.user ? 0 : await cart.findOne({ userId: req.user.id });
    const cartItems = cartCount ? cartCount.items : null;
    const fiction = await product.find({
      genre: "Fiction", $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]
    });
    fiction.forEach(book => {
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === book._id.toString());
        if (cartItem) {
          book.inCart = true;
          book.cartQty = cartItem.quantity;
        } else {
          book.inCart = false;
        }
      }
    });
    const biography = await product.find({
      genre: "Biography", $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]
    });
    biography.forEach(book => {
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === book._id.toString());
        if (cartItem) {
          book.inCart = true;
          book.cartQty = cartItem.quantity;
        } else {
          book.inCart = false;
        }
      }
    });
    const novels = await product.find({
      genre: "Novels", $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]
    });
    novels.forEach(book => {
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === book._id.toString());
        if (cartItem) {
          book.inCart = true;
          book.cartQty = cartItem.quantity;
        } else {
          book.inCart = false;
        }
      }
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
    if (cartCount !== null) {
      const cartId = cartCount._id
      res.render('categories', { fiction: fiction, biography: biography, novels: novels, horror: horror, science: science, selfhelp: selfhelp, cartId: cartId });
    } else {
      res.render('categories', { fiction: fiction, biography: biography, novels: novels, horror: horror, science: science, selfhelp: selfhelp, });
    }

  } catch (error) {
    res.status(500).send(notification('Oops, Something went wrong, please try again later'));
  }
}

exports.author = async (req, res, next) => {
  try {
    const search = req.query.searchQuery || "";
    const cartCount = !req.user ? 0 : await cart.findOne({ userId: req.user.id });
    const cartItems = cartCount ? cartCount.items : null;
    const Robert = await product.find({
      author: 'Robert T. Kiyosaki ', $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]
    });
    Robert.forEach(product => {
      product.offerPercentage = (Math.round(((product.originalPrice - product.price) * 100) / product.originalPrice));
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === product._id.toString());
        if (cartItem) {
          product.inCart = true;
          product.cartQty = cartItem.quantity;
        } else {
          product.inCart = false;
        }
      }

    });
    const jay = await product.find({
      author: 'Jay Shetty ', $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]
    });
    jay.forEach(product => {
      product.offerPercentage = (Math.round(((product.originalPrice - product.price) * 100) / product.originalPrice));
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === product._id.toString());
        if (cartItem) {
          product.inCart = true;
          product.cartQty = cartItem.quantity;
        } else {
          product.inCart = false;
        }
      }

    });
    const james = await product.find({
      author: 'James clear', $or: [
        { bookName: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
        { genre: { $regex: new RegExp(search, 'i') } }
      ]
    });
    james.forEach(product => {
      product.offerPercentage = (Math.round(((product.originalPrice - product.price) * 100) / product.originalPrice));
      if (cartItems) {
        const cartItem = cartItems.find(item => item.productId.toString() === product._id.toString());
        if (cartItem) {
          product.inCart = true;
          product.cartQty = cartItem.quantity;
        } else {
          product.inCart = false;
        }
      }

    });
    if (cartCount !== null) {
      const cartId = cartCount._id
      res.render('author', { robert: Robert, jay: jay, james: james, cartId: cartId });
    }
    res.render('author', { robert: Robert, jay: jay, james: james, });
  } catch (error) {
    res.status(500).send(notification('Oops, Something went wrong, please try again later'));
  }
}
