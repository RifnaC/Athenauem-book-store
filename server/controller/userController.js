const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

exports.home = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token){
        res.status(401).json({message:Unauthorized});
    }
    const decodeToken = jwt.verify(token, JWT_SECRET);
    const user = await userCollection.findById(decodeToken.id);
    res.render('home');
}


exports.dashboard = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decodeToken = jwt.verify(token, JWT_SECRET);
        const admin = await adminCollection.findById(decodeToken.id);

        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        if (admin.isSuperAdmin) {
            res.render('dashboard');
        } else {
            res.render('dashboard');
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

