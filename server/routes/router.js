const express = require('express')
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller')
const shopController = require('../controller/shopController');
const productController = require('../controller/productController');
const categoryController = require('../controller/categoryController');
const bannerController = require('../controller/bannerController');
const auth = require('../middlewares/authMiddleware')
const user = require('../controller/userController');
const order = require('../controller/orderController');
const pdf = require('../../assets/js/pdf');

// ***********************Admin Management********************************
/** 
 * @description Root Route
 * @method GET/
*/

route.get('/dashboard', auth.authMiddleware, services.homeRoutes);
/** 
 * @description Admin Route
 * @method GET/
*/
route.get("/admin" , auth.authMiddleware, auth.isAdmin, services.admin)

/** 
 * @description Add Admin
 * @method GET/
*/
route.get("/addAdmin" ,auth.authMiddleware, auth.isAdmin, services.addedAdmin)

/** 
 * @description Update Admin
 * @method GET/
*/
route.get("/editAdmin" ,auth.authMiddleware, services.edit_admin)


// API
route.post('/api/admins',auth.authMiddleware, controller.create);
route.get('/api/admins',  controller.find);
route.put('/api/admins/:id',auth.authMiddleware, auth.isAdmin, controller.update);
route.delete('/api/admins/:id',auth.authMiddleware,auth.isAdmin, controller.delete);

// ***********************Shop Management********************************
/** 
 * @description shop Route
 * @method GET/
*/
route.get('/shop',auth.authMiddleware, services.shop)

/** 
 * @description Add shop
 * @method GET/
*/
route.get("/addShop",auth.authMiddleware, auth.isVendor, services.add_Shop)

/** 
 * @description Edit shop
 * @method GET/
*/
route.get("/editShop",auth.authMiddleware, auth.isVendor, services.edit_Shop)

// API
route.post('/api/shops', auth.authMiddleware, auth.isVendor, shopController.create);
route.get('/api/shops', shopController.find);
route.get ('/books', auth.authMiddleware, services.shopDetails);
route.put('/api/shops/:id',auth.authMiddleware, auth.isVendor, shopController.update);
route.delete('/api/shops/:id',auth.authMiddleware, auth.isAdmin,shopController.delete)


// ***********************Product Management********************************
/** 
 * @description product Route
 * @method GET/
*/

route.get('/products',auth.authMiddleware, auth.isAdmin, services.product)

// /** 
//  * @description Add product 
//  * @method GET/
// */
route.get("/addProduct",auth.authMiddleware, auth.isVendor, services.add_product)

// /** 
//  * @description Edit product 
//  * @method GET/
// */
route.get("/editProduct", auth.authMiddleware, auth.isVendor, services.edit_product)

// API
route.post('/api/products', auth.authMiddleware, auth.isVendor, productController.create);
route.get('/api/products',productController.find);
route.put('/api/products/:id', auth.authMiddleware, auth.isVendor, productController.update);
route.delete('/api/products/:id', auth.authMiddleware, auth.isVendor, productController.delete)


// ***********************Category Management********************************
/** 
 * @description category Route
 * @method GET/
*/
route.get("/category",auth.authMiddleware, services.category)

/** 
 * @description add category 
 * @method GET/
*/
route.get("/addCategory",auth.authMiddleware, services.add_category)

/** 
 * @description Edit category 
 * @method GET/
*/
route.get("/editCategory",auth.authMiddleware, auth.isAdmin, services.edit_category)

// API
route.post('/api/categories',auth.authMiddleware, categoryController.create);
route.get('/api/categories', categoryController.find);
route.put('/api/categories/:id', auth.authMiddleware, auth.isAdmin, categoryController.update);
route.delete('/api/categories/:id', auth.authMiddleware, auth.isAdmin, categoryController.delete)

// ***********************banner Management********************************
/**
 * @description banner Route
 * @method GET/
*/
route.get("/banner",auth.authMiddleware, services.banner);

/**
 * @description add  banner
 * @method GET/
*/
route.get("/bannerPage",auth.authMiddleware,  services.createBanner)

/** 
 * @description Edit banner 
 * @method GET/
*/
route.get("/banners",auth.authMiddleware,services.editBanner)

// API
route.post('/api/banner',auth.authMiddleware, bannerController.create);
route.get('/api/banner', bannerController.find);
route.put('/api/banner/:id',auth.authMiddleware, bannerController.update);
route.delete('/api/banner/:id',auth.authMiddleware,  bannerController.delete);

// ***********************user Management********************************
route.get('/user',auth.authMiddleware, auth.isAdmin, services.user)
route.get("/editUser" ,auth.authMiddleware, auth.isAdmin, user.editUser);
route.put('/users/:id', auth.authMiddleware, auth.isAdmin,  user.update);
route.delete('/users/:id', auth.authMiddleware, auth.isAdmin, user.delete);
route.get('/userDetails', auth.authMiddleware, auth.isAdmin, user.userDetails);

// order Management
route.get('/order', auth.authMiddleware, order.allOrderDetails);
route.get('/orders', auth.authMiddleware, order.orderDetails);
route.put('/order/:id', auth.authMiddleware, order.editOrder);

// report Management
route.get('/report', auth.authMiddleware, order.reportView);
route.get('/latestOrder', auth.authMiddleware, order.latestOrder);
route.get('/itemsSales', auth.authMiddleware, order.itemSales);

// Error page
route.get('/error', services.error);

// 404 page
route.get('*', services.notFound);

module.exports = route