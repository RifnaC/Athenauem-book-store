const { log } = require('handlebars');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');
const Users = require('../models/userModel');

exports.checkout = async(req, res) => {
    const id = req.user.id;
    const user = await Users.findById(id);
    res.render('checkout', {user: user});
}