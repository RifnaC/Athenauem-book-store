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
    description: {
        type: String,
        required: true,
    },
    categoryImg:String,
    cloudinaryId:String
});

const genre = mongoose.model('categories', genreSchema);

module.exports = genre;