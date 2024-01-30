const Order = require('../models/orderModel');
const Book = require('../models/products');
const User = require('../models/userModel');
const Admin = require('../models/model');
const user = require('../models/userModel');

exports.allOrderDetails = async (req, res, next) => {
    const id = req.user.id;
    const admin = await Admin.findById(id);
    const name = admin.name.split(" ")[0];
    const orders = await Order.find({}).sort({orderDate:-1})
    let orderData = [];
    for(let order of orders){
        const user = await User.findOne({_id: order.userId});
    
        for(let item of order.orderItems){
            const itemDetails = await Book.findOne({_id:item.itemId})
            const total = itemDetails.price * item.quantity
            const quantity = item.quantity;
            orderData.push({order,itemDetails,user,total, quantity})
        }
    }
    console.log(orderData)
    res.render('orders', {admin:name, orders: orders, orderData: orderData})
}

exports.orderDetails = async(req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;
    const admin = await Admin.findById(userId);
    const name = admin.name.split(" ")[0];
    const orders = await Order.findById(id);
    let orderData = [];
    for(let item of orders.orderItems){
        const itemDetails = await Book.findOne({_id:item.itemId})
        const quantity = item.quantity;
        const total = itemDetails.price *quantity
        
    }
    console.log(orderData)
}