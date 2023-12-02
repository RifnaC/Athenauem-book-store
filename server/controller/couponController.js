const Coupon = require('../models/couponModel');
const adminCollection = require('../models/model');
const asyncHandler = require('express-async-handler');

exports.createCoupon = asyncHandler(async (req, res) => {
    try{
        const { couponCode, expireDate, discount } = req.body;
        const coupon = new Coupon({
            couponCode,
            expireDate,
            discount
        });
        await coupon.save();
        res.status(200).redirect('/offer');
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

exports.getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const id = req.user.id;
        const admin = await adminCollection.findById(id);
        const name = admin.name.split(" ")[0];
        const coupons = await Coupon.find();
        res.render('offer', { offers: coupons, admin: name});
    } catch (error) {
        throw new Error(error);
    }
});

// exports.updateCoupon = asyncHandler(async (req, res) => {
//     try{
//         const id = req.params
//         const { couponCode, expireDate, discount } = req.body;
//         const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
//             couponCode,
//             expireDate,
//             discount
//         });
//         res.status(200).redirect('/offer');
//     }catch(error){
//         throw new Error(error);
//     }
// })
