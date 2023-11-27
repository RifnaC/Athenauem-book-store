const express = require('express')
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');


route.get("/wishlist", services.wishlist);

route.get("/cart",auth.authMiddleware, services.cart, cart.cartView);
route.post("/cart",auth.authMiddleware, );
module.exports = route