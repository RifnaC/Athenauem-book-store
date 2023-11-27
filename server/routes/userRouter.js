const express = require('express')
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');


route.get("/wishlist", services.wishlist);

route.get("/api/carts", auth.authMiddleware, cart.cartView);
route.post("/api/carts", auth.authMiddleware, cart.addToCart );
module.exports = route