const axios = require('axios');
const adminCollection = require('../models/model');
const userCollection = require('../models/userModel');
const bannerCollection = require('../models/bannerModel');
const categoryCollection = require('../models/categoryModel');
const productCollection = require('../models/products');
const shops = require('../models/shopModel');
const user = require('../models/userModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');

// ***********************Admin Management********************************
exports.homeRoutes = async (req, res) => {
    if (!req.session.token) {
        return res.render('home')
    }
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('dashboard', { admin: name });
}

exports.admin = async (req, res) => {
    const id = req.user.id;
    if (req.user.role === 'admin') {
        const admin = await adminCollection.findById(id);
        const name = admin.name.split(" ")[0];
        const admins = await adminCollection.find({ role: { $ne: 'admin' } });
        axios.get('http://localhost:3000/api/admins')
        .then(function () {
            res.render('admin', { isAdmin: true, admins: admins, admin: name });
        })
        .catch(err => {
            res.send(err);
        })
    }
}

exports.addedAdmin = async (req, res) => {
    const id = req.user.id;
    if (req.user.role === 'admin') {
        const admin = await adminCollection.findById(id);
        const name = admin.name.split(" ")[0];
        res.render('addAdmin', { isAdmin: true, admin: name })
    }
};

exports.edit_admin = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/admins', { params: { id: req.query.id } })
    .then(function (AdminData) {
        res.render('editAdmin', { admins: AdminData.data, admin: name });
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************Shop Management********************************
exports.shop = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/shops')
    .then(function (response) {
        if (req.user.role === 'vendor') {
            res.render('shop', { isVendor: true, shops: response.data, admin: name });
        }
        res.render('shop', { shops: response.data, admin: name });
    })        
    .catch(error => {
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addShop';</script>");
    });
}

exports.add_Shop = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('addShop', { admin: name });
}

exports.edit_Shop = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/shops', { params: { id: req.query.id } })
    .then(function (shopData) {
        res.render('editShop', { shop: shopData.data, admin: name });
    })
    .catch(err => {
        res.send(err);
    })
}

exports.shopDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const admin = await adminCollection.findById(id);
        const name = admin.name.split(" ")[0];
        const shopId = req.query.id;
        const books = await productCollection.find({ shopId: { $eq: shopId } });
        axios.get('http://localhost:3000/api/shops', { params: { id: req.query.id } })
        .then(function (shopData) {
            if (req.user.role === 'vendor') {
                res.render('books', { isVendor: true, shop: shopData.data, admin: name, books });
            }
            res.render('books', { shop: shopData.data, admin: name, books });
        })
        .catch(err => {
            res.send(err);
        });
    } catch (error) {
        console.error('Error in shopDetails:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

// ***********************Product Management********************************
exports.product = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/products')
    .then(function (response) {
        if (req.user.role !== 'admin') {
            res.render('products', { isVendor: true, books: response.data, admin: name });
        }
        res.render('products', { books: response.data, admin: name });
    })        
    .catch(error => {
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addProduct';</script>");
    });
}

exports.add_product = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const category = await categoryCollection.find();
    if (req.user.role !== 'vendor') {
        res.render('addProduct', { admin: name, category });
    }
}

exports.edit_product = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const category = await categoryCollection.find();
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/products', { params: { id: req.query.id } })
    .then(function (bookData) {
        res.render('editproduct', { book: bookData.data, admin: name, category });
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************Category Management********************************
exports.category = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/categories')
    .then(function (response) {
        if (req.user.role === 'vendor') {
            res.render('category', { isVendor: true, categories: response.data, admin: name });
        } else {
            res.render('category', { isAdmin: true, categories: response.data, admin: name });
        }
    })
    .catch(error => {
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addCategory';</script>");
    });
}

exports.add_category = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    res.render('addCategory', { admin: name });
}

exports.edit_category = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/categories', { params: { id: req.query.id } })
    .then(function (genreData) {
        res.render('editCategory', { category: genreData.data, admin: name });
    })
    .catch(err => {
        res.send(err);
    })
}

// ***********************banner Management********************************
exports.banner = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/banner')
    .then(function (response) {
        res.render('banner', { banners: response.data, admin: name });
    })
    .catch(error => {
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/bannerPage';</script>");
    });
}

exports.createBanner = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const shop = await shops.find({})
    const genre = await categoryCollection.find({});
    const prdt = await productCollection.find({});
    res.render('bannerPage', { admin: name, shop: shop, genre: genre, book: prdt });
};

exports.editBanner = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    axios.get('http://localhost:3000/api/banner', { params: { id: req.query.id } })
        .then(function (ban) {
            res.render('banners', { banners: ban.data, admin: name });
        })
        .catch(err => {
            res.send(err);
        })
}

// ***********************Login Section*******************************
exports.login = (req, res) => {
    res.render('login');
}
exports.signup = (req, res) => {
    res.render('signUp');
}
// ***********************Customer CRUD Section*******************************
exports.user = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const user = await userCollection.find();
    res.render('user', { admin: name, users: user });
}


exports.home = async (req, res) => {
    try {
        const search = req.query.searchQuery || "";
        const latestImages = await bannerCollection
            .find({})
            .sort({ _id: -1 })
            .limit(3);
        const categories = await categoryCollection.find({});
        const products = await productCollection.find({ $or: [{ bookName: { $regex: '.*' + search + '.*' } }, { author: { $regex: '.*' + search + '.*' } }] }).limit(10);


        res.render('home', { images: latestImages, category: categories, product: products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.wishlist = (req, res) => {
    res.render('wishlist');
}
exports.error = (req, res) => {
    res.render('error');
}


exports.offers = (req, res) => {
    res.render('offers');
}

exports.updateOffer = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const coupon = await Coupon.findById(req.query.id);
    res.render('coupon', { offer: coupon, admin: name });
}

