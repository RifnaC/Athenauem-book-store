const mongoose = require('mongoose'); 

const genreSchema = new mongoose.Schema({
    genre:{
        type: String,
        required: true,
    },
    totalBooks:{
        type: Number,
        required: true,
    },
    totalEarnings: {
        type: String,
        required: true,
    }
});

const genre = mongoose.model('categories', genreSchema);

module.exports = genre;