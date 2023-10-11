const mongoose = require('mongoose');
// shop collection
const shopSchema = new mongoose.Schema({
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
    // shopImg:{
    //     type: String,
    //     required: true,
    // },
    address:{
        type: String,
        required: true,
    }
})

const Shopdb = mongoose.model('Shop', shopSchema);
module.exports = Shopdb;