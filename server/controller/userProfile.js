const users = require('../models/userModel');
const cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Book = require('../models/products');
const bcrypt = require('bcrypt');

function notification(msg) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <title>Atheneuam - Book Colleciton</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">
    
        <!-- Favicon -->
        <link href="img/book collection 0.png" rel="icon">
    
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body>
    <script> 
        Swal.fire({
            imageUrl: "/img/favicon.png",
            title: "Atheneuam",        
            imageWidth: 120,
            imageHeight: 80,
            imageAlt: "Atheneuam Logo",
            text: "${msg}",   
            confirmButtonText: 'Ok',     
            confirmButtonColor: '#15877C',
        });
    </script>
    </body>
    <!-- JavaScript Libraries -->
    </html>`
}
exports.profile = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await users.findById(id);
        const userAddress = user.addresses;
        const search = req.query.searchQuery || "";
        if (search !== "") {
            res.redirect("/shop-page");
        }
        res.render('profile', { user, userAddress });
    } catch (error) {
        res.status(500).send(notification('something went wrong, please try again later'));
    }
}

exports.updateProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await users.findById(id);

        if (!user) {
            return res.status(404).send(notification('user is not found'));
        }
        const ispswdValid = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!ispswdValid) {
            res.status(400).send(notification('password is not valid'));
            return;
        } else {
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = await bcrypt.hash(req.body.password, 10);
            user.gender = req.body.gender;

            // Save the updated user
            await user.save().then(() => {
                return res.status(200).render("profile");
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(notification("Something went wrong, please try again later"));
    }
}

exports.address = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await users.findById(id);
        res.render('address', { user });
    } catch (error) {
        res.status(500).send(notification("Something went wrong, please try again later"));
    }
}

exports.addAddress = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await users.findByIdAndUpdate({ _id: id }, {
        $push: {
            "addresses": {
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode,
            }
        }
    });
    await user.save().then(() => {
        res.status(200).render("profile");
    })
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}

exports.editAddress = async (req, res) => {
    try {
        const id = req.user.id;
        const addressId = req.query.id;
        const user = await users.findById(id);
        const userAddress = user.addresses.find(address => address._id == addressId);
        res.render('addresses', { user, userAddress, });
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const id = req.user.id;
        const addressId = req.params.id;
        const newAddress = await users.findOneAndUpdate({ _id: id, "addresses._id": addressId }, {
            $set: {
                "addresses.$.fullName": req.body.fullName,
                "addresses.$.phone": req.body.phone,
                "addresses.$.address": req.body.address,
                "addresses.$.city": req.body.city,
                "addresses.$.district": req.body.district,
                "addresses.$.state": req.body.state,
                "addresses.$.pincode": req.body.pincode
            }
        })
        await newAddress.save().then(() => {
            res.render('profile');
        })
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}

exports.deleteAddress = async (req, res) => {
    const id = req.user.id;
    const addressId = req.params.id;
    const orders = await Order.find({ userId: id, addressId: addressId });
    if (orders == []) {
        const newAddress = await users.findOneAndUpdate({ _id: id }, {
            $pull: {
                "addresses": {
                    _id: addressId
                }
            }
        });
        await newAddress.save().then(() => {
            res.render('profile');
        })
    } else {
        return res.status(400).send(notification("Address can't be deleted"));
    }

}

exports.myOrder = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await users.findById(id);
        const orders = await Order.find({ userId: id }).sort({ orderDate: -1 });
        const orderDatas = [];
        for (let order of orders) {
            for (let item of order.orderItems) {
                const itemDetails = await Book.findOne({ _id: item.itemId });
                const total = itemDetails.price * item.quantity
                const status = order.orderStatus
                const quantity = item.quantity
                orderDatas.push({ itemDetails, total, status, quantity, order })
            }
        }
        res.render('myOrder', { user, orderDatas, orders });
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}

exports.orderSummary = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const user = await users.findById(userId);
        const order = await Order.findOne({ _id: id });
        const addressDetails = await users.aggregate([{ $unwind: "$addresses" }, { $match: { "addresses._id": order.addressId } }]);
        const address = addressDetails[0].addresses;
        const orderData = [];
        let total = 0;
        for (let item of order.orderItems) {
            const orderItem = await Book.findOne({ _id: item.itemId });
            const quantity = item.quantity;
            total += orderItem.price * quantity;
            orderData.push({ orderItem, quantity, total });
        }
        const dateObject = new Date(order.orderDate);
        const orderDate = dateObject.toISOString().split('T')[0].split('-').reverse().join('-');

        const dateObject1 = new Date(order.deliveryDate);
        const deliveryDate = dateObject1.toISOString().split('T')[0].split('-').reverse().join('-');

        res.render('orderDetails', { user, address, order, orderData, orderDate, deliveryDate });
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}


exports.cancelOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const reason = req.body.reason;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send(notification('Order not found'));
        }
        for (const orderItem of order.orderItems) {
            const itemId = orderItem.itemId;
            const quantity = orderItem.quantity;
            await Book.findByIdAndUpdate({ _id: itemId }, { $inc: { quantity: quantity } });
        }
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id },
            { $set: { orderStatus: "Cancelled", cancelReason: reason } },
            { new: true }
        );
        if (updatedOrder) {
            res.json(updatedOrder);
        } else {
            res.status(500).send(notification("Failed to update order"));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(notification("Something went wrong, please try again later"));
    }
}


