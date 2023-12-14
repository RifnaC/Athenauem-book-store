const { log } = require('handlebars');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');

exports.checkout = async(req, res) => {
    res.render('checkout')
}