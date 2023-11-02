const mongoose = require('mongoose');

// banner collection
const bannerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    shop:{
        type: String,
        required:true,
    },
    type:{
        type: String,
        required:true,
    },
    categoryId:String,
    productId:String,
    bannerImg:String,
    cloudinaryId:String,
    isEnabled:{
        type:Boolean,
        default:false,
    }
})


const bannerCollection = mongoose.model('Banner', bannerSchema);
module.exports = bannerCollection;