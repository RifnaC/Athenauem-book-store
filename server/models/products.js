const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    // shopId: {
    //     type: String,
    //     required: true,
    // },
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
    // productImg:{
    //     type: String,
    //     required: true,
    // }

});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;