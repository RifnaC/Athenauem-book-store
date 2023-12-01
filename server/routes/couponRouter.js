const express = require('express')
const route = express.Router();
const services = require('../services/render');
const coupon  = require("../controller/couponController");
const auth = require('../middlewares/authMiddleware');

// coupon routes
route.post("/coupon",auth, coupon.createCoupon);