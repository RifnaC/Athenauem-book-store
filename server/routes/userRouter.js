const express = require('express');
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');
const user = require('../controller/userProfile');
const userController = require('../controller/userController');
const wishlistController = require('../controller/wishlistController');

route.get('/home', services.home);

route.get("/wishlist",auth.authMiddleware, wishlistController.wishlist);
route.get("/wishlist/:id",auth.authMiddleware, wishlistController.addToWishlist);
route.post("/wishlists", wishlistController.deleteWishlistItem);



// cart Routes
route.get("/cart", auth.authMiddleware, cart.cartView);
route.get("/carts/:id",  auth.authMiddleware, cart.addToCart);
route.post("/changeInQuantity", cart.changeQuantity);
route.post("/removeItem", cart.deleteCartItem);

// profile Routes
route.get("/profile", auth.authMiddleware, user.profile);
route.put("/profiles/:id", auth.authMiddleware, user.updateProfile);
route.get("/address", auth.authMiddleware, user.address);
route.put("/address/:id", auth.authMiddleware, user.addAddress);
route.get("/addresses", auth.authMiddleware, user.editAddress);
route.put("/addresses/:id", auth.authMiddleware, user.updateAddress);
route.put("/profile/:id", auth.authMiddleware, user.deleteAddress);

module.exports = route