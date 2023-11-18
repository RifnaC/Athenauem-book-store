const axios = require('axios');
const adminCollection = require('../models/model');
const userCollection = require('../models/userModel');
const bannerCollection = require('../models/bannerModel');
const categoryCollection = require('../models/categoryModel');
const productCollection  = require('../models/products');
const user = require('../models/userModel');
// ***********************Admin Management********************************
exports.homeRoutes = async(req, res)=>{
    if(!req.session.token){
        return res.render('home')
    }
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('dashboard',{admin: name});
}

exports.admin= async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/admins')
    .then(function (response) {
        res.render('admin',{admins: response.data, admin: name});
    })
    .catch(err =>{
        res.send(err);
    } )
}

exports.addedAdmin = async (req, res)=> {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('addAdmin', {admin: name})
};

exports.edit_admin= async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/admins',{params:{id:req.query.id}})
    .then(function(AdminData){
        res.render('editAdmin',{admin:AdminData.data, admin: name});
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************Shop Management********************************

exports.shop = async(req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
     axios.get('http://localhost:3000/api/shops')
    .then(function (response) {
        res.render('shop', {shops: response.data, admin: name});
    })
    .catch(error=>{
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addShop';</script>");
    });
}

exports.add_Shop = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('addShop', {admin: name});
}

exports.edit_Shop = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/shops',{params: {id:req.query.id}})
    .then(function(shopData){
        res.render('editShop',{shop:shopData.data, admin: name});
    })
    .catch(err => {
        res.send(err);
    })
    // res.render('editShop');
}

// ***********************Product Management********************************
exports.product= async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/products')
    .then(function (response) {
        res.render('products', {books: response.data , admin: name});
    })
    .catch(error=>{
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addProduct';</script>");
    });
}

exports.add_product = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const category = await categoryCollection.find();
    res.render('addProduct', {admin: name, category});
}

exports.edit_product = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/products',{params: {id:req.query.id}})
    .then(function(bookData){
        res.render('editproduct',{book:bookData.data, admin: name});
    })
    .catch(err => {
        res.send(err);
    })
    // res.render('editProduct');
}

// ***********************Category Management********************************
exports.category = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/categories')
    // console.log(response.data);
    .then(function (response) {
        res.render('category', {categories: response.data, admin: name});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addCategory';</script>");
    });
    // res.render('category');
}

exports.add_category = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('addCategory', {admin: name});
}

exports.edit_category = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/categories',{params: {id:req.query.id}})
    .then(function(genreData){
        res.render('editCategory',{category:genreData.data, admin: name});
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************banner Management********************************
exports.banner = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/banner')
    .then(function (response) {
        res.render('banner', {banners: response.data, admin: name});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/bannerPage';</script>");
    });
}

exports.createBanner = async (req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('bannerPage', {admin: name});
};

exports.editBanner = async(req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/banner',{params: {id:req.query.id}})
    .then(function(ban){
        res.render('banners',{banners:ban.data, admin: name});
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
    try {
    const latestImages = await bannerCollection
        .find({})
        .sort({ _id: -1 })
        .limit(3); 
    const categories = await categoryCollection.find({});
    const products = await productCollection.find({}).limit(10);
    const id = req.user.id;
    console.log(id);
    const user = await userCollection.findById(id);
    const name = user.name.split(" ")[0];
    
        res.render('home', { images: latestImages, category: categories, product: products, user: name});
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  

}

exports.wishlist= (req, res)=>{
    res.render('wishlist');
}
