const axios = require('axios');
const adminCollection = require('../models/model');
const userCollection = require('../models/userModel');
const bannerCollection = require('../models/bannerModel');
const categoryCollection = require('../models/categoryModel');
const productCollection = require('../models/products');
const shops = require('../models/shopModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const { itemSales } = require('../controller/orderController');

// ***********************Admin Management********************************
exports.homeRoutes = async (req, res) => {
    if (!req.cookies.token) {
        return res.render('home')
    }
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];

    const userCount = await User.find().countDocuments();
    const adminCount = await adminCollection.find().countDocuments();
    const prdtsCount = await productCollection.find().countDocuments();
    const genre = await categoryCollection.find().countDocuments();
    const orders = await Order.find();
    const offers = await Coupon.find().countDocuments();
    const banners = await bannerCollection.find().countDocuments();
    const totalRevenue = orders.filter(order => order.orderStatus === 'Delivered').reduce((acc, order) => acc + order.payableTotal, 0);
    const deliveredOrders = orders.filter(order => order.orderStatus === 'Delivered');
    const pendingOrders = orders.filter(order => order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled');
    const cancelledOrders = orders.filter(order => order.orderStatus === 'Cancelled');
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    let length =new Date(currentYear, currentMonth, 0).getDate();
    

    const dailyReport = await Order.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $month: "$orderDate" }, currentMonth] // Filter orders for the current month
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%d",
                        date: "$orderDate"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                count: 1,
            }
        },
        {
            $sort: { date: 1 }
        }
    ])

    const dailyCart= await Cart.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $month: "$updatedAt" }, currentMonth] // Filter cart for the current month
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%d",
                        date: "$updatedAt"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                count: 1,
            }
        },
        {
            $sort: { date: 1 }
        }
    ])
  
    const allDates = Array.from({ length: length }, (e, index) => {
        const day = index + 1;
        return day < 10 ? '0' + day : day.toString();
    });

    // Initialize a new array with totalAmount set to 0 for each date
    const dailyOrders = allDates.map(date => {
        const entry = dailyReport.find(report => report.date === date);
        return { count: entry ? entry.count : 0, date };
    });
    const dates = dailyOrders.map(date => date.date);
    const counts = dailyOrders.map(date => date.count); 

    const dailyCarts = allDates.map(date => {
        const entry = dailyCart.find(report => report.date === date);
        return { count: entry ? entry.count : 0, date };
    });
    const cartCounts = dailyCarts.map(itemSales => itemSales.count);

    const monthlyReport = await Order.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$orderDate' },
                    month: { $month: '$orderDate' }
                },
                amount: { $sum: '$payableTotal' },
                count: { $sum: 1 },
            }
        }
    ]);
    const month = monthlyReport.map((months) => months._id.month);
    const monthlyAmt = monthlyReport.map((amt) => amt.amount);
    const monthlyCount = monthlyReport.map((count) => count.count);
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

    // Create a new array with zero amounts for months with no orders
    const monthlyAmount = allMonths.map((m) => {
        const index = month.indexOf(m);
        return index !== -1 ? monthlyAmt[index] : 0;
    });
    const monthlyCounts = allMonths.map((m) => {
        const index = month.indexOf(m);
        return index !== -1 ? monthlyCount[index] : 0;
    });

    const totalOrders = await Order.find({}).limit(5).sort({ orderDate: -1 });
    let orderData = [];
    for (let order of totalOrders) {
        const user = await User.findOne({ _id: order.userId });
        const userName = user.name.split(" ")[0];
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        orderData.push({ order, userName, orderDate })
    }


    res.render('dashboard', {
        admin: name,
        userCount: userCount,
        adminCount: adminCount,
        prdtsCount: prdtsCount,
        totalRevenue: totalRevenue,
        genre: genre,
        totalOrders: orders.length,
        offers: offers,
        banners: banners,
        deliveredOrders: deliveredOrders.length,
        pendingOrders: pendingOrders.length,
        cancelledOrders: cancelledOrders.length,
        amounts: monthlyAmount,
        counts: monthlyCounts,
        orderData: orderData,
        dates: dates,
        dailyOrders: counts,
        cartCounts: cartCounts,
    });
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
    const name = admin.name.split(" ")[0];;
    const shop = await shops.find({})
    const genre = await categoryCollection.find({});
    const prdt = await productCollection.find({});
    axios.get('http://localhost:3000/api/banner', { params: { id: req.query.id } })
        .then(function (ban) {
            res.render('banners', { banners: ban.data, admin: name, shop: shop, genre: genre, book: prdt });
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

exports.forgotPswd = (req, res) => {
    res.render('forgotPswd');
}
// ***********************Customer CRUD Section*******************************
exports.user = async (req, res) => {
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const user = await userCollection.find();
    res.render('user', { admin: name, users: user });
}


// logined user
exports.userHome = async (req, res) => {
    try {
        const cartCount = await Cart.findOne({ userId: req.user.id });
        const search = req.query.searchQuery || "";
        const latestImages = await bannerCollection
            .find({})
            .sort({ _id: -1 })
            .limit(3);
        const categories = await categoryCollection.find({});
        const genreLength = categories.length;
        let count;
        if (genreLength > 5) {
            count = true;
        }
        const products = await productCollection
            .find({
                discount: { $gt: 0 },
                $or: [
                    { bookName: { $regex: '.*' + search + '.*' } },
                    { author: { $regex: '.*' + search + '.*' } },
                ]
            }).limit(10);
        products.forEach(product => {
            product.offerPercentage = (Math.round(((product.originalPrice - product.price) * 100) / product.originalPrice));
        });
        let availibility;
        if (products.stock === "Out Of Stock") {
            availibility = true;
        }
        if (cartCount !== null) {
            const cartId = cartCount._id;
            res.render('home', { images: latestImages, category: categories, product: products, count: count, cartId: cartId, availibility: availibility });
        } else {
            res.render('home', { images: latestImages, category: categories, product: products, count: count, availibility: availibility });
        }

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

exports.notFound = (req, res) => {
    res.render('404');
}