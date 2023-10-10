const express = require('express')
const route = express.Router();

const services = require('../services/render');
const controller = require('../controller/controller')
const shopController = require('../controller/shopController');
const store = require('../middlewares/multer');

// ***********************Admin Management********************************
/** 
 * @description Root Route
 * @method GET/
*/
route.get("/index", services.homeRoutes)

/** 
 * @description Admin Route
 * @method GET/
*/
route.get("/admin" , services.admin)

/** 
 * @description Add Admin
 * @method GET/
*/
route.get("/addAdmin" , services.add_admin)

/** 
 * @description Update Admin
 * @method GET/
*/
route.get("/editAdmin" , services.edit_admin)

/** 
 * @description Update Admin Password
 * @method GET/
*/
route.get("/changePswd" , services.change_pswd)

// API
route.post('/api/admins',controller.create);
route.get('/api/admins',controller.find);
route.put('/api/admins/:id',controller.update);
// route.put('/updatePassword', controller.update_password);
route.delete('/api/admins/:id',controller.delete)


// ***********************Shop Management********************************

/** 
 * @description shop Route
 * @method GET/
*/
route.get("/shop", services.shopRoute)

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
route.post('/api/shops',store.upload, shopController.create);
// route.get('/api/shops',shopController.find);
// route.put('/api/shops/:id',shopController.update);
// route.delete('/api/shops/:id',shopController.delete)


// ***********************Product Management********************************
/** 
 * @description product Route
 * @method GET/
*/
route.get("/products", services.product)

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

module.exports = route