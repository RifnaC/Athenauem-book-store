const Order = require('../models/orderModel');
const Book = require('../models/products');
const User = require('../models/userModel');
const Admin = require('../models/model');
const puppeteer = require('puppeteer');
const fs = require('fs');
const handlebars = require('handlebars');

exports.allOrderDetails = async (req, res, next) => {
    const id = req.user.id;
    const admin = await Admin.findById(id);
    const name = admin.name.split(" ")[0];
    const orders = await Order.find().sort({ orderDate: -1 }).exec();
    let orderData = [];
    for (let order of orders) {
        const user = await User.findOne({ _id: order.userId });
        const userName = user.name.split(" ")[0];
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        orderData.push({ order, userName, orderDate })
    }
    res.render('orders', { admin: name, orders: orders, orderData: orderData });
}

exports.orderDetails = async (req, res, next) => {
    const id = req.query.id;
    const userId = req.user.id;
    const admin = await Admin.findById(userId);
    const name = admin.name.split(" ")[0];
    const order = await Order.findById(id);
    let orderData = [];
    const user = await User.findById(order.userId);
    const userAddress = await User.findOne(
        { _id: order.userId, 'addresses._id': order.addressId },
        { 'addresses.$': 1 });
    const dateObject = new Date(order.orderDate);
    const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
    const dateObject1 = new Date(order.deliveryDate);
    const deliveryDate = dateObject1.toISOString().split('T')[0].split('-').reverse().join('-');
    for (let item of order.orderItems) {
        const itemDetails = await Book.findOne({ _id: item.itemId })
        const quantity = item.quantity;
        const total = itemDetails.price * quantity
        orderData.push({ itemDetails, total, quantity })
    }
    res.render('order', { admin: name, users: user, address: userAddress.addresses[0], order: order, deliveryDate: deliveryDate, orderDate: orderDate, orderDatas: orderData });
}

exports.editOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const status = req.body.orderStatus;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        let updatedOrder;
        if (req.body.orderStatus === "Delivered") {
            updatedOrder = await Order.findOneAndUpdate(
                { _id: id },
                { $set: { orderStatus: req.body.orderStatus, orderDate: new Date().toLocaleDateString() } },
                { new: true }
            );
        } else {
            updatedOrder = await Order.findOneAndUpdate(
                { _id: id },
                { $set: { orderStatus: req.body.orderStatus } },
                { new: true }
            );
        }
        console.log(updatedOrder);
        if (updatedOrder) {
            res.json(updatedOrder);
        } else {
            res.status(500).json({ error: "Failed to update order" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.reportView = async (req, res, next) => {
    const id = req.user.id;
    const admin = await Admin.findById(id);
    const name = admin.name.split(" ")[0];
    const orderLength = await Order.find().countDocuments();
    const deliveredLength = await Order.find({ orderStatus: "Delivered" }).countDocuments();
    const pendingLength = await Order.find({ $or: [{ orderStatus: "Order Placed" }, { orderStatus: "Shipped" }] }).countDocuments();
    const cancelledLength = await Order.find({ orderStatus: "Cancelled" }).countDocuments();
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth() + 1; 
    const dailyReport = await Order.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $month: "$orderDate" }, currentMonth] // Filter orders for the current month
                }
            }
        },
       {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%d",
                        date: "$orderDate"
                    }
                },
                totalAmount: { $sum: "$payableTotal" }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                totalAmount: 1,
            }
        },
        {
            $sort: { date: 1 }
        }
    ])


    const allDates = Array.from({ length: 31 }, (e, index) => {
        const day = index + 1;
        return day < 10 ? '0' + day : day.toString();
    });

    // Initialize a new array with totalAmount set to 0 for each date
    const dailyOrders = allDates.map(date => {
        const entry = dailyReport.find(report => report.date === date);
        return { totalAmount: entry ? entry.totalAmount : 0, date };
    });
    const dates = dailyOrders.map(date => date.date);
    const amounts = dailyOrders.map(date => date.totalAmount);

    // Calculate the start and end of the current week
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
    const weeklyReport = await Order.aggregate([
        {
            $match: {
                orderDate: {
                    $gte: startOfWeek,
                    $lte: endOfWeek,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%d", date: "$orderDate" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ])
    const data = weeklyReport.map(entry => entry.count);

    const orders = await Order.find({}).limit(5).sort({ orderDate: -1 });
    let orderData = [];
    for (let order of orders) {
        const user = await User.findOne({ _id: order.userId });
        const userName = user.name.split(" ")[0];
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        orderData.push({ order, userName, orderDate })
    }

    const monthlyReport = await Order.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$orderDate' },
                    month: { $month: '$orderDate' }
                },
                amount: { $sum: '$payableTotal' }
            }
        }
    ])

    const month = monthlyReport.map((months) => months._id.month);
    const monthlyAmt = monthlyReport.map((amt) => amt.amount);
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

    // Create a new array with zero amounts for months with no orders
    const monthlyAmount = allMonths.map((m) => {
        const index = month.indexOf(m);
        return index !== -1 ? monthlyAmt[index] : 0;
    });
    res.render('chart', { admin: name, count: orderLength, deliveredLength: deliveredLength, pendingLength: pendingLength, cancelledLength: cancelledLength, dates: dates, amounts: amounts, orderData: orderData, weeklyReport: data, monthlyAmount: monthlyAmount });
}

exports.latestOrder = async(req, res) => {
    const orders = await Order.find({}).limit(10).sort({ orderDate: -1 });
    let orderData = [];
    for (let order of orders) {
        const user = await User.findOne({ _id: order.userId });
        const userName = user.name.split(" ")[0];
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        orderData.push({ order, userName, orderDate });
    }

    res.render('latestOrder', { orderData: orderData })
}

exports.itemSales = async(req, res) => {
    const id = req.user.id;
    const admin = await Admin.findById(id);
    const name = admin.name.split(" ")[0];
    const orderLength = await Order.find().countDocuments();
    const deliveredLength = await Order.find({ orderStatus: "Delivered" }).countDocuments();
    const pendingLength = await Order.find({ $or: [{ orderStatus: "Order Placed" }, { orderStatus: "Shipped" }] }).countDocuments();
    const cancelledLength = await Order.find({ orderStatus: "Cancelled" }).countDocuments();
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth() + 1; 
    const dailyReport = await Order.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $month: "$orderDate" }, currentMonth] // Filter orders for the current month
                }
            }
        },
       {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%d",
                        date: "$orderDate"
                    }
                },
                totalAmount: { $sum: "$payableTotal" }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                totalAmount: 1,
            }
        },
        {
            $sort: { date: 1 }
        }
    ])


    const allDates = Array.from({ length: 31 }, (e, index) => {
        const day = index + 1;
        return day < 10 ? '0' + day : day.toString();
    });

    // Initialize a new array with totalAmount set to 0 for each date
    const dailyOrders = allDates.map(date => {
        const entry = dailyReport.find(report => report.date === date);
        return { totalAmount: entry ? entry.totalAmount : 0, date };
    });
    const dates = dailyOrders.map(date => date.date);
    const amounts = dailyOrders.map(date => date.totalAmount);

    // Calculate the start and end of the current week
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
    const weeklyReport = await Order.aggregate([
        {
            $match: {
                orderDate: {
                    $gte: startOfWeek,
                    $lte: endOfWeek,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%d", date: "$orderDate" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ])
    const data = weeklyReport.map(entry => entry.count);

    const orders = await Order.find({}).limit(5).sort({ orderDate: -1 });
    let orderData = [];
    for (let order of orders) {
        const user = await User.findOne({ _id: order.userId });
        const userName = user.name.split(" ")[0];
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');
        orderData.push({ order, userName, orderDate })
    }

    const monthlyReport = await Order.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$orderDate' },
                    month: { $month: '$orderDate' }
                },
                amount: { $sum: '$payableTotal' }
            }
        }
    ])

    const month = monthlyReport.map((months) => months._id.month);
    const monthlyAmt = monthlyReport.map((amt) => amt.amount);
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

    // Create a new array with zero amounts for months with no orders
    const monthlyAmount = allMonths.map((m) => {
        const index = month.indexOf(m);
        return index !== -1 ? monthlyAmt[index] : 0;
    });
    res.render('reports', { admin: name, count: orderLength, deliveredLength: deliveredLength, pendingLength: pendingLength, cancelledLength: cancelledLength, dates: dates, amounts: amounts, orderData: orderData, weeklyReport: data, monthlyAmount: monthlyAmount });
}
