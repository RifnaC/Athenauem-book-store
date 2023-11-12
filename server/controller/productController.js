const { log } = require('handlebars');
const Shopdb = require('../models/shopModel')
const Productdb = require('../models/products');
const { product } = require('../services/render');
const cloudinary = require('../services/cloudinary');
const path = require('path')
const multer = require('multer');
const { response } = require('express');

// access multer middleware storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname.split('.').pop())
  },
}); 

const upload = multer({ storage: storage });

exports.fetchShopDetails = async(shopId) => {
  try {
    const shop = await Shopdb.findById(shopId);      
    return shop;
  } catch (error) {
    console.error('Error fetching shop details:', error);
    throw error;
  }
};

exports.renderShopDetails = async(req, res) =>{
  const shopId = req.query.id;
  const shopDetails = await this.fetchShopDetails(shopId);
  res.render('products', {shop: shopDetails})
};
   
// Function to fetch books for a shop by shop ID
exports.fetchBooksForShop = async (shopId) => {
  try {
    const books = await Productdb.find({ shopId: shopId });
    return books;
  } catch (error) {
    console.error('Error fetching books for shop:', error);
    throw error;
  }
};

// Function to render the products page
exports.renderProducts = async (req, res) => {
  const shopId = req.query.id;
  const books = await this.fetchBooksForShop(shopId);
  res.locals.books = books;
  res.render('products');
};

// create and save new product
exports.create = async (req, res) => {
  upload.single('productImg')(req, res, async(err) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if(!req.body){
      res.status(400).send({ message:'Content can not be empty' });
      return;
    }
    const {bookName, genre, author, price, quantity, description} = req.body;
    const productImg = req.file.path;
    cloudinary.uploader.upload(productImg,(cloudinaryErr, results) => {
      if (cloudinaryErr){
        res.status(500).send({ message: cloudinaryErr.message});
        return;
      }
      const product = new Productdb({
        bookName,
        genre, 
        author, 
        price, 
        quantity, 
        description,
        productImg: results.secure_url,
        cloudinaryId: results.public_id,
      });
      product.save()
      .then(savedProduct => {
        res.redirect('/products');
      })
      .catch(savedErr => {
        res.status(500).send({ message: savedErr.message});
      });
    })
  })
};

// retrieve and return all product or  retrieve and return a single  product
exports.find = (req, res) => {
  if(req.query.id){
    const id = req.query.id;
    Productdb.findById(id)
    .then(data => {
      if(!data){
        res.status(404).send({message:"Not found product with id" + id})
      }else{
        res.send(data)
      }
    })
    .catch(err => {
      res.status(500).send({message:"Error in retrieving product with id" + id})
    })
  }else{
    Productdb.find()
    .then(book => {
      // If it's an API request, send JSON data
      if (req.path === '/api/products') {
        res.json(book);
      } else {
        // If it's a web request, render the "" page with the data
        // console.log(books);
        res.render('products', {books: book});
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving product information" });
    });
  }
}
  
// Update a new identified book by book id
exports.update = (req, res) => {
  upload.single('productImg'), (req, res, async(err) =>{
    console.log(res);
    if(err){
      res.status(500).send({ message: err.message });
      return;
    }
    try{
      const id = req.params.id;
      const book = await Productdb.findById(id);        
      console.log(book);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      if (req.file) {
        // Delete the old book image from Cloudinary
        await cloudinary.uploader.destroy(book.cloudinaryId);

        // Upload the new book image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
  
        // Update the book image URL and Cloudinary ID
        book.productImg = result.secure_url;
        book.cloudinaryId = result.public_id;
      }
      // Update other book details based on your form data
      book.bookName = req.body.bookName || book.bookName;
      book.genre = req.body.genre || book.genre;
      book.author = req.body.author || book.author;
      book.price = req.body.price || book.price;
      book.quantity = req.body.quantity || book.quantity;
      book.description = req.body.description || book.description;
      await book.save();
      return res.status(200).json(book);
    }catch(err){
      console.error(err);
      return res.status(500).json({message: 'An error occurred while updating the book'})
    }
  })
}

// Delete the book by its id
exports.delete = (req, res) => {
  const id = req.params.id;
  Productdb.findById(id)
  .then(book => {
      if(!book){
        res.status(404).send({message: `Book with id ${id} not found`});
      }else{
        cloudinary.uploader.destroy(book.cloudinaryId, (cloudinaryErr, result) => {
          if(cloudinaryErr){
            console.error('Error deleting book from cloudinary', cloudinaryErr);
          }
          Productdb.findByIdAndDelete(id)
          .then(() => { 
            res.send({message: 'Book deleted successfully'});
          })
          .catch(err => {
            res.status(500).send({message: `Could not delete book with id ${id}`});
          })
        });
      }
  })
  .catch(err => {
    res.status(500).send({
      message:"Error finding book with id "+ id
    });
  })
}