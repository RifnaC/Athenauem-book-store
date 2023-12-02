const express = require('express')
const route = express.Router();
const services = require('../services/render');
const coupon  = require("../controller/couponController");
const auth = require('../middlewares/authMiddleware');
// add  offer route
route.get("/offers", auth.authMiddleware, services.offers);

// update offer route
route.get("/coupon", auth.authMiddleware, services.updateOffer);

// coupon api routes
route.get("/offer", auth.authMiddleware, coupon.getAllCoupon);
route.post("/coupon", auth.authMiddleware, coupon.createCoupon);
route.put("/coupon/:id", auth.authMiddleware, coupon.updateCoupon);
route.delete("/coupon/:id", auth.authMiddleware, coupon.deleteCoupon);


module.exports = route