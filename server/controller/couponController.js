const Coupon = require('../models/couponModel');
const adminCollection = require('../models/model');
const asyncHandler = require('express-async-handler');
const cron = require('node-cron');

function notification(msg) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <title>Atheneuam - Book Colleciton</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">
    
        <!-- Favicon -->
        <link href="img/book collection 0.png" rel="icon">
    
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body>
    <script> 
        Swal.fire({
          imageUrl: "/img/favicon.png",
          title: "Atheneuam",
          imageWidth: 120,
          imageHeight: 80,
          imageAlt: "Atheneuam Logo",
          text: "${msg}",
          confirmButtonColor: '#15877C',
        }).then((result) => {
          history.back();
        })
    </script>
    </body>
    <!-- JavaScript Libraries -->
    
    </html>`
}
// create  coupon
exports.createCoupon = asyncHandler(async (req, res) => {
    try {
        const { couponCode, expireDate, discount } = req.body;
        const coupon = new Coupon({
            couponCode,
            expireDate,
            discount
        });
        await coupon.save();
    } catch (error) {
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
        res.render('offer', { offers: coupons, admin: name });
    } catch (error) {
        throw new Error(error);
    }
});

// Edit coupon
exports.updateCoupon = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const coupons = await Coupon.find();
        const { couponCode, expireDate, discount } = req.body;
        const coupon = await Coupon.findByIdAndUpdate(id, {
            couponCode,
            expireDate,
            discount
        },{ new: true });
        res.status(200).send({ coupon: coupon });
    } catch (error) {
        throw new Error(error);
    }
})

// Delete coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id,);
        res.status(200).render('offer');

    } catch (error) {
        throw new Error(error);
    }
})

const deleteExpiredCoupons = async () => {
    try {
        const currentDate = new Date();
        console.log('Current Date:', currentDate);
        const result = await Coupon.deleteMany({ expireDate: { $lt: currentDate } });
        console.log('Deleted Coupons:', result.deletedCount);
        console.log('Deleted Coupons Details:', result);
    } catch (error) {
        res.status(500).send(notification('Error deleting expired coupons'));
    }
};
// Schedule the function to run every day at midnight
cron.schedule('0 0 * * *', deleteExpiredCoupons);
