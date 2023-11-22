const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName:{
        type: String,
        required: true,
    },
    shopId:{
        type: ObjectId,
        required: true,
    },
    genre:{
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    originalPrice:{
        type: Number,
        required: true,
    },
    discount:{
        type: Number,
        default: 0,
        required: true,
    },
    stock:{
      type: String,
      required: true,  
    },
    productImg:String,
    cloudinaryId:String
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;