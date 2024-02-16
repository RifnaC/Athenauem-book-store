const Cart = require("../models/cartModel");
const auth = require('../middlewares/authMiddleware');


exports.cartQty = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        const length = cart.items != null ? cart.items.length : 0;
        req.cart = cart;
        res.locals.length = length;  // Store cart length in res.locals
        next();
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}