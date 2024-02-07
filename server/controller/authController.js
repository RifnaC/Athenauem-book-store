const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const session = require('express-session');
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Token = require('../models/tokenModel');
const sendEmail = require('../services/sendEmail');
// ***********************user Management********************************
// Register and save new user
const signToken = (id,user)=> {
    if(!user) return jwt.sign(id, JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
    else return jwt.sign({id,role:user.role}, JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

exports.register = async(req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    try{
        // Check if the email already exists in the database
        const existingUser = await userCollection.findOne({ email: req.body.email });
        const existingEmail = await adminCollection.findOne({ email: req.body.email });
        if (existingUser || existingEmail){ 
            // Display an alert when email is already taken.
            res.status(200).send(
                "<script>alert('Email already exists'); window.location.href ='/signup';</script>"
            );
            return;
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = new userCollection({
            name: req.body.name,
            email: req.body.email,                
            password:  hashedPassword,
            role: 'User',
            status: req.body.status,
        });
        const token = signToken({id:user._id, role: user.role});
        // save user in database
        const savedUser = await user.save();
        if(token){
            res.redirect('/homes');
        }
    }catch(err){
        res.status(500).send({
            message:err.message || "Some error occured while creating a create operation"
        });
    }
};

//login section
exports.login = async(req, res) => {
    try{
        const user = await userCollection.findOne({email: req.body.email});
        const admin = await adminCollection.findOne({email:req.body.email});
        if(!user && !admin){
            res.status(404).send({message: "This email is not found."})
            return;
        }
        const ispswdValid = await bcrypt.compare(req.body.password, (user || admin).password);
        if(!ispswdValid){
            res.status(401).send({message: "Invalid password."});
            return;
        }
        const data = {
            id: (user || admin).id,
            email: (user || admin).email,
            role: admin ? admin.role : 'User',
            name: (user || admin).name,
            status: (user || admin).status,
        };
        const token = signToken((user || admin)._id,data);
        res.cookie('token', token, { httpOnly: true, secure: true });
        // req.session.token = token;
        if (data.role !== 'User') {
            res.redirect('/dashboard');
        } else {
           if(user.status === 'Block'){
            res.render('login',{Blocked: true});
           }else{
            res.redirect('/homes');
           }
        }
    }catch (e) {
        console.error(e);
        res.status(500).send({message:'Internal Server Error'});
    }   
}

// Logout function
exports.logout = async(req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};


exports.forgotPassword = async(req, res) => {
    try{
        const email = req.body.email;
        const existingEmail = await adminCollection.findOne({ email: email });
        const existingUser = await userCollection.findOne({ email: email });
        if(!existingEmail && !existingUser){
            res.status(404).send(`<script>alert('Email not found');
            Swal.fire('Error', 'Email not found', 'error');</script>`);
            return;
        }
        const token = await Token.findOne({ $or: [{ userId: user._id}, { adminId: user._id}]});
        if (token) { 
            await token.deleteOne()
        };
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);

        const updatedToken = await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();
        
        updatedToken.then(() => {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user: process.env.EMAIL,
                    password: process.env.PASSWORD
                }


            })
        })
    }catch(err){
        
    }
}







