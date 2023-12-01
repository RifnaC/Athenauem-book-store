const Coupon = require('../models/couponModel');
const validateMongoDdId = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');

exports.createCoupon = asyncHandler(async (req, res) => {
    try{
        const coupon = await Coupon.create(req.body);
        res.json(coupon);

    }catch(error){
        throw new Error(error);
    }

})