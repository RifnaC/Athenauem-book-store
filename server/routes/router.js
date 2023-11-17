const express = require('express')
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller')
const shopController = require('../controller/shopController');
const productController = require('../controller/productController');
const categoryController = require('../controller/categoryController');
const bannerController = require('../controller/bannerController');
const auth = require('../middlewares/authMiddleware')


// ***********************Admin Management********************************
/** 
 * @description Root Route
 * @method GET/
*/
// route.get("/dashboard", services.homeRoutes)

/** 
 * @description Admin Route
 * @method GET/
*/
route.get("/admin" , auth.authMiddleware, services.admin)

/** 
 * @description Add Admin
 * @method GET/
*/
route.get("/addAdmin" ,auth.authMiddleware, services.addedAdmin)

/** 
 * @description Update Admin
 * @method GET/
*/
route.get("/editAdmin" ,auth.authMiddleware, services.edit_admin)

// API

route.post('/api/admins',auth.authMiddleware, controller.create);
route.get('/api/admins', controller.find);
route.put('/api/admins/:id',auth.authMiddleware, controller.update);
route.delete('/api/admins/:id',auth.authMiddleware, controller.delete);

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
route.get("/addShop",auth.authMiddleware, services.add_Shop)

/** 
 * @description Edit shop
 * @method GET/
*/
route.get("/editShop",auth.authMiddleware, services.edit_Shop)

// API
route.post('/api/shops',auth.authMiddleware, shopController.create);
route.get('/api/shops',shopController.find);
route.put('/api/shops/:id',auth.authMiddleware, shopController.update);
route.delete('/api/shops/:id',auth.authMiddleware, shopController.delete)


// ***********************Product Management********************************
/** 
 * @description product Route
 * @method GET/
*/

route.get('/products',auth.authMiddleware, services.product)
route.get('/products',auth.authMiddleware, productController.renderShopDetails);
route.get('/products',auth.authMiddleware, productController.renderProducts);

/** 
 * @description Add product 
 * @method GET/
*/
route.get("/addProduct",auth.authMiddleware, services.add_product)


/** 
 * @description Edit product 
 * @method GET/
*/
route.get("/editProduct", auth.authMiddleware, services.edit_product)


route.post('/api/products', auth.authMiddleware, productController.create);
route.get('/api/products',productController.find);
route.put('/api/products/:id', auth.authMiddleware, productController.update);
route.delete('/api/products/:id', auth.authMiddleware, productController.delete)


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
route.get("/editCategory",auth.authMiddleware, services.edit_category)



route.post('/api/categories',auth.authMiddleware, categoryController.create);
route.get('/api/categories',categoryController.find);
route.put('/api/categories/:id', auth.authMiddleware, categoryController.update);
route.delete('/api/categories/:id', auth.authMiddleware, categoryController.delete)

// ***********************banner Management********************************
// /** 
//  * @description banner Route
//  * @method GET/
// */
route.get("/banner",auth.authMiddleware, services.banner);

// /** 
//  * @description add  banner
//  * @method GET/
// */
route.get("/bannerPage",auth.authMiddleware, services.createBanner)

/** 
 * @description Edit banner 
 * @method GET/
*/
route.get("/banners",auth.authMiddleware, services.editBanner)

route.post('/api/banner',auth.authMiddleware, bannerController.create);
route.get('/api/banner', bannerController.find);
route.put('/api/banner/:id',auth.authMiddleware, bannerController.update);
route.delete('/api/banner/:id',auth.authMiddleware, bannerController.delete);


// route.get("/home", services.home);


module.exports = route