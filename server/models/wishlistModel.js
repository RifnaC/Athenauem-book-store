const mongoose = require('mongoose'); 
const books = require('./products');
const { ObjectId } = require('mongodb');

const wishlistSchema  = new mongoose.Schema({
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
},{
    timestamps: true
});

module.exports = mongoose.model('wishlist', wishlistSchema);