const mongoose = require('mongoose');

// banner collection
const orderScheme = new mongoose.Schema({
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    totalAmt:{
        type: Number,
    },
    discount:{
        type: Number,
    },
    paymentMethod:{
        type: String,
    },
    orderStatus:{
        type: String,
        default: "pending",
    },
    orderItems:{
        type: Array,
        default: [],
    },
    orderDate:{
        type: Date,
        default: new Date().toLocaleDateString(),
    },
    deliveryDate :{
        type: Date,
        default:  function() { new Date(this.orderDate);
            DateExpire.setDate(orderDate.getDate() + 5);
            return DateExpire.toLocaleDateString();
        }
    }
})


const orderCollection = mongoose.model('Orders', orderScheme);
module.exports = orderCollection;