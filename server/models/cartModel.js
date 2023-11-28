const mongoose = require('mongoose'); 
const books = require('./products');
const { ObjectId } = require('mongodb');

const cartSchema = new mongoose.Schema({
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    items: [{ 
        productId : {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'books'
        }
    }],  
     totalPrice: {
        type: Number, 
        default: 0
    },
    quantity:{
        type: Number,
        default: 1
    }
},{
    timestamps: true
});

module.exports = mongoose.model('cart', cartSchema);