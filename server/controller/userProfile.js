const users = require('../models/userModel');
const cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Book = require('../models/products');

exports.profile = async(req, res)=>{
    const cartCount = await cart.findOne({userId: req.user.id})
    const length = cartCount.items.length
    const id = req.user.id;
    const user = await users.findById(id);
    const userAddress = user.addresses;
    const search = req.query.searchQuery || "";
    if (search !== "") {
        res.redirect("/shop-page");
    }
    res.render('profile', {user, userAddress, length});
}

exports.updateProfile = async(req, res)=>{
    const id = req.params.id;
    const user = await users.findByIdAndUpdate(id, req.body, {new: true});
    await user.save().then(()=>{
        res.render('profile');
    }).catch(err=>{
        console.log(err);
    });
}

exports.address = async(req, res)=>{
    const id = req.user.id;
    const cartCount = await cart.findOne({userId: req.user.id})
    const user = await users.findById(id);
    res.render('address', {user, length:cartCount.items.length});
}

exports.addAddress = async (req, res)=>{
    const id = req.user.id;
    const user = await users.findByIdAndUpdate({_id:id}, {$push:{
        "addresses": {
            fullName:req.body.fullName,
            phone:req.body.phone,
            address:req.body.address,
            city:req.body.city,
            district:req.body.district,
            state:req.body.state,
            pincode:req.body.pincode,
        }
    }});
    user.save().then(()=>{
        res.render('profile');
    }).catch(err=>{
        console.log(err);
    })
}

exports.editAddress = async(req, res)=>{
    const id = req.user.id;
    const cartCount = await cart.findOne({userId: req.user.id})
    const addressId = req.query.id;
    const user = await users.findById(id);
    const userAddress = user.addresses.find(address=> address._id == addressId);   
    res.render('addresses',{user, userAddress, length:cartCount.items.length});
}

exports.updateAddress = async(req, res)=>{
    const id = req.user.id;
    const addressId = req.params.id;
    const newAddress = await users.findOneAndUpdate({_id:id, "addresses._id":addressId}, {$set:{
        "addresses.$.fullName":req.body.fullName,
        "addresses.$.phone":req.body.phone,
        "addresses.$.address":req.body.address,
        "addresses.$.city":req.body.city,
        "addresses.$.district":req.body.district,
        "addresses.$.state":req.body.state,
        "addresses.$.pincode":req.body.pincode
    }})
    await newAddress.save().then(()=>{
        res.render('profile');
    })
}

exports.deleteAddress = async(req, res)=>{
    const id = req.user.id;
    const addressId = req.params.id;
    const newAddress = await users.findOneAndUpdate({_id:id}, {$pull:{
        "addresses": {
            _id:addressId
        }
    }});
    await newAddress.save().then(()=>{
        res.render('profile');
    })
}

exports.myOrder = async(req, res)=>{
    const id = req.user.id;
    const user = await users.findById(id);
    const cartCount = await cart.findOne({userId: req.user.id})
    const length = cartCount.items.length;
    const orders = await Order.find({userId: id}).sort({orderDate: -1});
    const orderDatas = [];
    for (let order of orders){
        for (let item of order.orderItems){
            const itemDetails = await Book.findOne({ _id: item.itemId});
            const total = itemDetails.price * item.quantity
            const status = order.orderStatus
            const quantity = item.quantity
            orderDatas.push({itemDetails,total,status,quantity,order})
        }
    }
    res.render('myOrder', {length, user,orderDatas, orders });
}

exports.orderSummary = async(req, res, next) => {
    const id = req.user.id;
    const user = await users.findById(id);
    const cartCount = await cart.findOne({userId: id})
    const length = cartCount.items.length;
    const orders = await Order.find({userId: id}).sort({orderDate: -1});
}