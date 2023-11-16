const express = require('express')
const route = express.Router();
const services = require('../services/render');


route.get("/wishlist", services.wishlist);


module.exports = route