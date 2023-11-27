const mongoose = require('mongoose'); 

const item = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
    },
    total:{
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        min:[1, 'Quantity can not be less then 1.'],
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    shopId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shops',
    },
},{
    timestamps: true
});

const cartSchema = new mongoose.Schema({
    items:[item],
    subTotal:{
        default: 0,
        type: Number,
    }
},{
    timestamps: true
});

module.exports = mongoose.model('cart', cartSchema);