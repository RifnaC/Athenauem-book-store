const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
        UPPERCASE: true,
    },
    expireDate:{
        type:Date,
        require: true
    },
    discount:{
        type:Number,
        require: true
    }
});

const coupons = mongoose.model('Coupons', couponSchema);