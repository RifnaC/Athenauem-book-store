const Coupon = require('../models/couponModel');
const adminCollection = require('../models/model');
const asyncHandler = require('express-async-handler');
// create  coupon
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
        throw new Error(error);
    }
})

// get coupon
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

// Edit coupon
exports.updateCoupon = asyncHandler(async (req, res) => {
    try{
        const coupons = await Coupon.find();
        const { couponCode, expireDate, discount } = req.body;
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
            couponCode,
            expireDate,
            discount
        }).then(coupon =>{
            res.status(200).render('offer', { offer:coupon});
        });
        console.log(coupon)
        
    }catch(error){
        throw new Error(error);
    }
})
// coupon editing form


// Delete coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
    try{
        await Coupon.findByIdAndDelete(req.params.id,);
        res.status(200).render('offer');
        
    }catch(error){
        throw new Error(error);
    }
})
