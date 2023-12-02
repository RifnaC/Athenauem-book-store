const express = require('express')
const route = express.Router();
const services = require('../services/render');
const coupon  = require("../controller/couponController");
const auth = require('../middlewares/authMiddleware');
// add  offer route
route.get("/offers", auth.authMiddleware, services.offers);

// coupon api routes
route.get("/offer", auth.authMiddleware, coupon.getAllCoupon);
route.post("/coupon", auth.authMiddleware, coupon.createCoupon);
// route.put("/coupon/:id", auth.authMiddleware, coupon.updateCoupon);

module.exports = route