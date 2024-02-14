const express = require('express');
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');
const user = require('../controller/userProfile');
const checkout = require('../controller/checkoutController');
const wishlistController = require('../controller/wishlistController');
const productController = require('../controller/productViewController')
const cartQty = require('../middlewares/cartQuantity');
// home page
route.get('/', auth.authMiddleware, cartQty.cartQty, services.userHome);
route.get('/home', (req,res)=>{
    res.redirect('/')
});

// product view page
route.get('/productView/:id', auth.authMiddleware, cartQty.cartQty, productController.productView);
route.get('/shop-page', auth.authMiddleware, cartQty.cartQty, productController.shopPage);
route.post('/shop-page', auth.authMiddleware, productController.shopPageFilter);
route.get('/category', auth.authMiddleware, cartQty.cartQty, productController.category);
route.get('/author', auth.authMiddleware, cartQty.cartQty, productController.author);

// wishlist Routes
route.get("/wishlist", auth.authMiddleware, cartQty.cartQty, wishlistController.wishlist);
route.get("/wishlist/:id", auth.authMiddleware, wishlistController.addToWishlist);
route.put("/wishlists", auth.authMiddleware, wishlistController.deleteWishlistItem);
route.put("/wishlist", auth.authMiddleware, wishlistController.addAllToCart);
route.put("/clearWishlist", auth.authMiddleware, wishlistController.clearWishlist);

// cart api 
route.get("/cart", auth.authMiddleware, cart.cartView);
route.get("/carts/:id", auth.authMiddleware, cart.addToCart);
route.post("/carts", auth.authMiddleware, cart.updateCart);
route.post("/changeInQuantity", cart.changeQuantity);
route.post("/removeItem", cart.deleteCartItem);

// profile Routes
route.get("/profile", auth.authMiddleware, cartQty.cartQty, user.profile);
route.put("/profiles/:id", auth.authMiddleware, user.updateProfile);

// address Routes
route.get("/address", auth.authMiddleware, cartQty.cartQty, user.address);
route.put("/address/:id", auth.authMiddleware, user.addAddress);
route.get("/addresses", auth.authMiddleware, cartQty.cartQty, user.editAddress);
route.put("/addresses/:id", auth.authMiddleware, user.updateAddress);
route.put("/profile/:id", auth.authMiddleware, user.deleteAddress);

// myOrder Routes
route.get('/myOrder', auth.authMiddleware, cartQty.cartQty, user.myOrder);
route.get('/order/:id', auth.authMiddleware, cartQty.cartQty, user.orderSummary);
route.put('/order/:id', auth.authMiddleware, user.cancelOrder);

// checkout Routes
route.get("/checkout", auth.authMiddleware, cartQty.cartQty, checkout.checkout);
route.put("/checkout/:id", auth.authMiddleware, checkout.changeAddress);
route.post("/createOrder", auth.authMiddleware, checkout.proceedToPayment);
route.post("/api/checkout", auth.authMiddleware, checkout.getOrder);
route.post("/api/payment/verify", auth.authMiddleware, checkout.verifyPayment);

// invoice Routes
route.get("/invoice", auth.authMiddleware, checkout.invoice);

// 404 page
route.get('*', services.notFound);

module.exports = route;