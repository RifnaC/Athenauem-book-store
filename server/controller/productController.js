const { log } = require('handlebars');
const Shopdb = require('../models/shopModel')
const Productdb = require('../models/products');
const { product } = require('../services/render');

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
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    // console.log(req.body);
    const product = new Productdb({
    bookName:req.body.bookName,
    genre: req.body.genre,
    author: req.body.author,
    price: req.body.price,
    quantity: req.body.quantity,
    description: req.body.description,
    // productImg: req.body.productImg,
});
  const savedProduct = await product.save(); 
  console.log(savedProduct);
  res.redirect('/products');
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
  

  // Update a new identified book by   id
  exports.update = (req, res) => {
    if(!req.body){
         return res.status(400).send({message:"Data to update can not be empty"})
     }
     const id = req.params.id;
    //  console.log(req.body);
     Productdb.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
     .then(data =>{
         if(!data){
             return res.status(404).send({message:`Book with ${id} is not found`})
         }else{
             res.send(data);
         }
     })
     .catch(err => {
         res.status(500).send({message: "Error Update Book information"})
     })
  }
  
  
  
  
  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Productdb.findByIdAndDelete(id)
    .then(data => { 
        if(!data){
            res.status(404).send({message: `Book with ${id} is not found`})
        }else{
            res.send({
                message: "Book is deleted successfully"
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message:"Could not delete book with id "+ id
        })
    })
    
  }