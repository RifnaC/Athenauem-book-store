const axios = require('axios');
const bannerCollection = require('../models/bannerModel')
const categoryCollection = require('../models/categoryModel')
const productCollection  = require('../models/products')
// ***********************Admin Management********************************
exports.homeRoutes = (req, res)=>{
    res.render('dashboard');
}

exports.admin= (req, res)=>{
    axios.get('http://localhost:3000/api/admins')
    .then(function (response) {
        res.render('admin',{admins: response.data});
    })
    .catch(err =>{
        res.send(err);
    } )
}

exports.addedAdmin= (req, res)=> res.render('addAdmin');

exports.edit_admin= (req, res)=>{
    axios.get('http://localhost:3000/api/admins',{params:{id:req.query.id}})
    .then(function(AdminData){
        res.render('editAdmin',{admin:AdminData.data});
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************Shop Management********************************

exports.shop=(req, res)=>{
     axios.get('http://localhost:3000/api/shops')
    .then(function (response) {
        res.render('shop', {shops: response.data});
    })
    .catch(error=>{
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addShop';</script>");
    });
}

exports.add_Shop=(req, res)=>{
    res.render('addShop');
}

exports.edit_Shop=(req, res)=>{
    axios.get('http://localhost:3000/api/shops',{params: {id:req.query.id}})
    .then(function(shopData){
        res.render('editShop',{shop:shopData.data});
    })
    .catch(err => {
        res.send(err);
    })
    // res.render('editShop');
}


// ***********************Product Management********************************
exports.product=(req, res)=>{
    axios.get('http://localhost:3000/api/products')
    // console.log(response.data);
    .then(function (response) {
        res.render('products', {books: response.data});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addProduct';</script>");
    });
}

exports.add_product=(req, res)=>{
    res.render('addProduct');
}

exports.edit_product=(req, res)=>{
    axios.get('http://localhost:3000/api/products',{params: {id:req.query.id}})
    .then(function(bookData){
        res.render('editproduct',{book:bookData.data});
    })
    .catch(err => {
        res.send(err);
    })
    // res.render('editProduct');
}

// ***********************Category Management********************************
exports.category=(req, res)=>{
    axios.get('http://localhost:3000/api/categories')
    // console.log(response.data);
    .then(function (response) {
        res.render('category', {categories: response.data});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addCategory';</script>");
    });
    // res.render('category');
}

exports.add_category=(req, res)=>{
    res.render('addCategory');
}

exports.edit_category=(req, res)=>{
    axios.get('http://localhost:3000/api/categories',{params: {id:req.query.id}})
    .then(function(genreData){
        res.render('editCategory',{category:genreData.data});
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************banner Management********************************
exports.banner = (req, res)=>{
    axios.get('http://localhost:3000/api/banner')
    .then(function (response) {
        res.render('banner', {banners: response.data});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/bannerPage';</script>");
    });
}

exports.createBanner = (req, res)=>{
    res.render('bannerPage');
};

exports.editBanner= (req, res)=>{
    axios.get('http://localhost:3000/api/banner',{params: {id:req.query.id}})
    .then(function(ban){
        res.render('banners',{banners:ban.data});
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************Login Section*******************************
exports.login= (req, res)=>{
    res.render('login');
}
exports.signup= (req, res)=>{
    res.render('signUp');
}

exports.home= async(req, res)=>{
    // Modify the route to fetch the three latest images
    try {
      const latestImages = await bannerCollection
        .find({})
        .sort({ _id: -1 })
        .limit(3); 
  
     const categories = await categoryCollection.find({});
     const products = await productCollection.find({}).sort({ _id: -1 }).limit(10);
      res.render('home', { images: latestImages, category: categories, product: products });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  

}
