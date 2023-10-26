const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName:{
        type: String,
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
    productImg:String,
    cloudinaryId:String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;