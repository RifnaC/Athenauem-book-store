const mongoose = require('mongoose');

// banner collection
const orderScheme = new mongoose.Schema({
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    totalAmt:{
        type: Number,
        required:true,
    },
    discount:{
        type: Number,
    },
    paymentMethod:{
        type: String,
        required:true,
    },
    orderStatus:{
        type: String,
        default: "pending",
    },
    orderItems:{
        type: Array,
        default: [],
    },
    orderDate : Date,
    // new Date().toLocaleDateString(),
    deliveryDate : Date
    //  new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
})


const orderCollection = mongoose.model('Orders', orderScheme);
module.exports = orderCollection;