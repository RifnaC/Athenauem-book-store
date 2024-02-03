const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const session = require('express-session');
const JWT_SECRET = process.env.JWT_SECRET;
const cookie = require('cookie');
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
    // Clear the session and redirect to the login page
    // req.session.destroy((err) => {
    //     // if (err) {
    //     //     console.error('Error destroying session:', err);
    //     //     res.status(500).send({ message: 'Internal Server Error' });
    //     // } else {
    //         res.redirect('/login');
    //     }
    // });
    res.clearCookie('token');
    res.redirect('/login');
};






