const { log } = require('handlebars');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');
const userController = require('../controller/userController');

exports.checkout = async(req, res) => {
    const id = req.user.id;
    const user = await userController.findById(id);
    const adr = user.addresses[0];
    res.render('checkout')
}