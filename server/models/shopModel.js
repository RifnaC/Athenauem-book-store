const mongoose = require('mongoose');

// shop collection
const shopSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    },
    openingTime:{
        type: String,
        required:true,
    },
    closingTime:{
        type: String,
        required:true,
    },
    shopImg:String,
    cloudinaryId:String,
    address:{
        type: String,
        required: true,
    },
    books:[{ 
        type: Array,
        ref: 'books', 
    }]
})

const Shopdb = mongoose.model('Shop', shopSchema);
module.exports = Shopdb;