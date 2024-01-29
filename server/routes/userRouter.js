const express = require('express');
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');
const user = require('../controller/userProfile');
const userController = require('../controller/userController');
const checkout = require('../controller/checkoutController');
const wishlistController = require('../controller/wishlistController');
const productController = require('../controller/productViewController')

// home page
route.get('/home', services.home);
route.get('/homes',auth.authMiddleware, services.userHome);

// product view page
route.get('/productView/:id',auth.authMiddleware,productController.productView);
route.get('/shop-page', auth.authMiddleware, productController.shopPage);
route.post('/shop-page', auth.authMiddleware, productController.shopPageFilter);
route.get('/category', auth.authMiddleware, productController.category);
route.get('/author', auth.authMiddleware, productController.author);
route.get('/contact', productController.contact);

// wishlist Routes
route.get("/wishlist",auth.authMiddleware, wishlistController.wishlist);
route.get("/wishlist/:id",auth.authMiddleware, wishlistController.addToWishlist);
route.put("/wishlists", auth.authMiddleware, wishlistController.deleteWishlistItem);
route.put("/wishlist",auth.authMiddleware, wishlistController.addAllToCart);
route.put("/clearWishlist", auth.authMiddleware, wishlistController.clearWishlist);

// cart Routes
route.get("/cart", auth.authMiddleware, cart.cartView);
route.get("/carts/:id",  auth.authMiddleware, cart.addToCart);
route.post("/carts", auth.authMiddleware, cart.updateCart);
route.post("/changeInQuantity", cart.changeQuantity);
route.post("/removeItem", cart.deleteCartItem);

// profile Routes
route.get("/profile", auth.authMiddleware, user.profile);
route.put("/profiles/:id", auth.authMiddleware, user.updateProfile);

// address Routes
route.get("/address", auth.authMiddleware, user.address);
route.put("/address/:id", auth.authMiddleware, user.addAddress);
route.get("/addresses", auth.authMiddleware, user.editAddress);
route.put("/addresses/:id", auth.authMiddleware, user.updateAddress);
route.put("/profile/:id", auth.authMiddleware, user.deleteAddress);

// myOrder Routes
route.get('/myOrder', auth.authMiddleware, user.myOrder);
route.get('/order/:id', auth.authMiddleware, user.orderSummary);

// checkout Routes
route.get("/checkout", auth.authMiddleware, checkout.checkout);
route.put("/checkout/:id", auth.authMiddleware, checkout.changeAddress);
route.get("/", checkout.payment);
route.post("/createOrder", auth.authMiddleware, checkout.proceedToPayment);
route.post("/api/checkout", auth.authMiddleware, checkout.getOrder);


// invoice Routes
route.get("/invoice", auth.authMiddleware, checkout.invoice);

module.exports = route