const express = require('express')
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');
const user = require('../controller/userProfile');
const userController = require('../controller/userController');

route.get('/home', services.home);

route.get("/wishlist", services.wishlist);



// cart Routes
route.get("/cart", auth.authMiddleware, cart.cartView);
route.get("/carts/:id",  auth.authMiddleware, cart.addToCart);
route.post("/changeInQuantity", cart.changeQuantity);
route.post("/removeItem", cart.deleteCartItem);

// profile Routes
route.get("/profile", auth.authMiddleware, user.profile);
route.put("/profile/:id", auth.authMiddleware, user.updateProfile);
route.get("/address", auth.authMiddleware, user.address);

module.exports = route