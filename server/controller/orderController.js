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
        const userName = user.name.split(" ")[0];
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        orderData.push({order,userName,orderDate})
    }
    res.render('orders', {admin:name, orders: orders, orderData: orderData})
}

exports.orderDetails = async(req, res, next) => {
    const id = req.query.id;
    const userId = req.user.id;
    const admin = await Admin.findById(userId);
    const name = admin.name.split(" ")[0];
    const order = await Order.findById(id);
    let orderData = [];
    const user = await User.findById(order.userId);
    const userAddress = await User.findOne(
        {_id: order.userId,'addresses._id':order.addressId},
        {'addresses.$':1});
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        const dateObject1 = new Date(order.deliveryDate);
        const deliveryDate = dateObject1.toISOString().split('T')[0].split('-').reverse().join('-');
    for(let item of order.orderItems){
        const itemDetails = await Book.findOne({_id:item.itemId})
        const quantity = item.quantity;
        const total = itemDetails.price *quantity
        orderData.push({itemDetails,total,quantity})
    }
    console.log(orderData)
    res.render('order', {admin:name, users: user, address: userAddress.addresses[0], order:order, deliveryDate:deliveryDate, orderDate:orderDate, orderDatas:orderData});
}