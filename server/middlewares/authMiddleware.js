const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;


exports.home = async (req, res) => {
    res.render('home');
}

exports.authMiddleware = async(req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token Verification Error:', err);
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}