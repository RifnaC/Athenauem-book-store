const express = require('express')
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller')
const shopController = require('../controller/shopController');
const productController = require('../controller/productController');
const categoryController = require('../controller/categoryController');
const bannerController = require('../controller/bannerController');

// ***********************Admin Management********************************
/** 
 * @description Root Route
 * @method GET/
*/
route.get("/dashboard", services.homeRoutes)

/** 
 * @description Admin Route
 * @method GET/
*/
route.get("/admin" , services.admin)

/** 
 * @description Add Admin
 * @method GET/
*/
route.get("/addAdmin" , services.addedAdmin)

/** 
 * @description Update Admin
 * @method GET/
*/
route.get("/editAdmin" , services.edit_admin)

// API
route.post('/api/admins',controller.create);
route.get('/api/admins',controller.find);
route.put('/api/admins/:id',controller.update);
route.delete('/api/admins/:id',controller.delete)

// ***********************Shop Management********************************
/** 
 * @description shop Route
 * @method GET/
*/
route.get('/shop', services.shop)

/** 
 * @description Add shop
 * @method GET/
*/
route.get("/addShop", services.add_Shop)

/** 
 * @description Edit shop
 * @method GET/
*/
route.get("/editShop", services.edit_Shop)

// API
route.post('/api/shops',shopController.create);
route.get('/api/shops',shopController.find);
// route.get('/api/shops/:id',shopController.findProducts);
route.put('/api/shops/:id',shopController.update);
route.delete('/api/shops/:id',shopController.delete)


// ***********************Product Management********************************
/** 
 * @description product Route
 * @method GET/
*/

route.get('/products', services.product)
route.get('/products', productController.renderShopDetails);
route.get('/products', productController.renderProducts);

/** 
 * @description Add product 
 * @method GET/
*/
route.get("/addProduct", services.add_product)


/** 
 * @description Edit product 
 * @method GET/
*/
route.get("/editProduct", services.edit_product)


route.post('/api/products',productController.create);
route.get('/api/products',productController.find);
route.put('/api/products/:id',productController.update);
route.delete('/api/products/:id',productController.delete)


// ***********************Category Management********************************
/** 
 * @description category Route
 * @method GET/
*/
route.get("/category", services.category)

/** 
 * @description add category 
 * @method GET/
*/
route.get("/addCategory", services.add_category)

/** 
 * @description Edit category 
 * @method GET/
*/
route.get("/editCategory", services.edit_category)



route.post('/api/categories',categoryController.create);
route.get('/api/categories',categoryController.find);
route.put('/api/categories/:id',categoryController.update);
route.delete('/api/categories/:id',categoryController.delete)

// ***********************banner Management********************************
// /** 
//  * @description banner Route
//  * @method GET/
// */
route.get("/banner", services.banner);

// /** 
//  * @description add  banner
//  * @method GET/
// */
route.get("/bannerPage", services.createBanner)

/** 
 * @description Edit banner 
 * @method GET/
*/
route.get("/banners", services.editBanner)

route.post('/api/banner', bannerController.create);
route.get('/api/banner', bannerController.find);
route.put('/api/banner/:id', bannerController.update);
route.post('/api/banner/:id', bannerController.banner);
route.delete('/api/banner/:id', bannerController.delete);


// ***********************Login Section********************************
// /** 
//  * @description Login Route
//  * @method GET/
// */
route.get("/home", services.login);


module.exports = route