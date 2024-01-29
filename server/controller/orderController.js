const Order = require('../models/orderModel');
const Book = require('../models/products');
const user = require('../models/userModel');
const Admin = require('../models/model')

exports.allOrderDetails = async (req, res, next) => {
    const id = req.user.id;
    const admin = await Admin.findById(id);
    const name = admin.name.split(" ")[0];
    const order = await Order.find({}).sort({orderDate:-1})
    res.render('orders', {admin:name, orders: order})
}