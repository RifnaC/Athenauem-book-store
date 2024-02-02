const Cart = require("../models/cartModel");
const auth = require('../middlewares/authMiddleware');


exports.cartQty = async(req, res, next) => {
    const cart = await Cart.findOne({ userId: req.user.id });
    const length = cart.items.length || 0;
    req.cart = cart;
    next();
}