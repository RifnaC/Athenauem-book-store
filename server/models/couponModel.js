const mongoose = require('mongoose');
const cron = require('node-cron');
const Coupon = require('../models/couponModel');

const deleteExpiredCoupons = async () => {
    try {
        const currentDate = new Date();
        console.log('current date: ' + currentDate);
        await Coupon.deleteMany({ expireDate: { $lt: currentDate } });
        console.log('Delete expired coupons successfully', result.deletedCount);
    } catch (error) {
        console.error('Error deleting expired coupons:', error);
    }
};

// Schedule the function to run every day at midnight
cron.schedule('0 0 * * *', deleteExpiredCoupons);

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

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports= Coupon;