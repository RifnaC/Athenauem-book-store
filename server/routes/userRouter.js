const express = require('express')
const route = express.Router();
const services = require('../services/render');
const auth = require('../middlewares/authMiddleware');
const cart = require('../controller/cartController');
const user = require('../controller/userController');


route.get("/wishlist", services.wishlist);

// cart Routes
route.get("/cart", auth.authMiddleware, cart.cartView);
route.get("/carts/:id",  auth.authMiddleware, cart.addToCart);
route.post("/changeInQuantity", cart.changeQuantity);
route.post("/removeItem", cart.deleteCartItem);

route.get("/editUser" ,auth.authMiddleware, user.editUser);
route.put('/users/:id', auth.authMiddleware, user.update);



module.exports = route