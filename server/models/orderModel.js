const mongoose = require('mongoose');

const orderScheme = new mongoose.Schema({   
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    addressId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
    },
    orderItems:[{
        itemId: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'books',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number
    }],
    TotalAmt:{
        type: Number,
    },
    discount:{
        type: Number,
    },
    couponCode: String,
    payableTotal: Number,
    paymentMethod:{
        type: String,
    },
    orderStatus:{
        type: String,
        default: "pending",
    },
    orderDate:{
        type: Date,
        default: new Date().toLocaleDateString(),
    },
    deliveryDate :{
        type: Date,
        default: function() {
        const orderDate = new Date(this.orderDate); // Ensure orderDate is accessed correctly
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 days to deliveryDate
        return deliveryDate.toLocaleDateString();
        }

    },
})


const orderCollection = mongoose.model('Orders', orderScheme);
module.exports = orderCollection;