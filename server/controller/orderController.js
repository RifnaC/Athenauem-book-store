const Order = require('../models/orderModel');
const Book = require('../models/products');
const User = require('../models/userModel');
const Admin = require('../models/model');
const Genre = require('../models/categoryModel');

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

    const books = await Book.find();
    const title = books.map((book) => book.bookName);
    const outOfStock = await Book.find({ stock: "Out Of Stock" }).countDocuments();
    const availablePrdts = await Book.find({stock: 'In Stock' }).countDocuments();
    const orders = await Order.find({});
    let orderData = [];
    for (let order of orders) {
        const orderItems = order.orderItems;

        // Iterate over order items to aggregate quantity and price by genre
        for (let item of orderItems) {
            const book = await Book.findById(item.itemId); // Retrieve book details
            if (!book) continue; 
            const genre = book.genre;
            const name = item.name;
            const quantity = item.quantity;
            const price = book.price * quantity;
            orderData.push({ order, genre, name, quantity, price, });
        }
    
    }
    
    const aggregatedData = {};
    const bookData ={};
    // Iterate over each item in orderData array
    orderData.forEach(item => {
        const {genre, name, quantity, price } = item;
    
        // If the genre doesn't exist in aggregatedData, initialize it with quantity and price
        if (!aggregatedData[genre]) {
            aggregatedData[genre] = { count: 0, total: 0 };
        }
        if(!bookData[name]){
            bookData[name] = { count: 0, total: 0 };
        }

        // Accumulate quantity and price for each genre
        aggregatedData[genre].count += quantity;
        aggregatedData[genre].total += price;

        bookData[name].total += price;
    });

    // Convert aggregatedData object into an array of objects
    const genres = Object.entries(aggregatedData).map(([genre, { count, total }]) => ({ genre, count, total }));
    const genre = genres.map((genre) => genre.genre);
    const genreCount = genres.map((genreCount) => genreCount.count);

    const bookstore = Object.entries(bookData).map(([name, {total }]) => ({name, total}));
    const names = bookstore.map((name) => name.name);
    const amounts = bookstore.map((amount) => amount.total);

    res.render('reports', { admin: name, count: books.length, outOfStock: outOfStock, availablePrdts: availablePrdts, orderData: orderData,genre: genre, genreCount: genreCount, names: names, amounts: amounts});
}
