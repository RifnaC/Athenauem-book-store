const express = require('express')
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');


route.get("/wishlist", services.wishlist);
// route.get ('/cart', services.cart);

// route.get("/cart", auth.authMiddleware, services.cart);
// route.post("/api/carts/:id", auth.authMiddleware, cart.addToCart );

route.get("/cart", auth.authMiddleware, cart.cartView);
route.get("/carts/:id",  auth.authMiddleware, cart.addToCart)

module.exports = route