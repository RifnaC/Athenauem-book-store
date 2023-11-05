const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const saltRounds = 10;
// const {  } = require('express-validator');

const JWT_SECRET = process.env.jwt;
// ***********************user Management********************************
// Register and save new user
exports.register = async(req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    try{
        // Check if the email already exists in the database
        const existingUser = await userCollection.findOne({ email: req.body.email });
        const existingEmail = await adminCollection.findOne({ email: req.body.email });
        if (existingUser || existingEmail) { 
            // Display an alert when email is already taken.
            res.status(200).render('signup',{isRepeatedEmail: true});
                // "<script>alert('Email already exists'); window.location.href ='/signup';</script>"
        
            return;
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = new userCollection({
            name: req.body.name,
            email: req.body.email,                
            password:  hashedPassword
        });
        // save user in database
        const savedUser = await user.save();
        res.redirect('/home');
    }catch(err){
        res.status(500).send({
            message:err.message || "Some error occured while creating a create operation"
        });
    }
};

exports.login = async(req, res) => {
    const user = await userCollection.findOne({
        email: req.body.email
    });
    if(!user) {
        const admin = await adminCollection.findOne({
            email: req.body.email
        })
        if(!admin){
            res.status(404).send({message: "This email is not found."});
        }
        
        const ispswdValid = await bcrypt.compare(req.body.password, admin.password);
        if(!ispswdValid){
            res.status(401).send({message: "Invalid password."});
        }
        const token = jwt.sign({
            id:admin._id,
            email: admin.email,
        },
        JWT_SECRET,{
            expiresIn: "2h",
        });
        res.status(200).redirect('/dashboard')
        // res.status(404).send({message: "This email is not found."});
    }
    else{
        const ispswdValid = await bcrypt.compare(req.body.password, user.password);
        if(!ispswdValid){
            res.status(401).send({message: "Invalid password."});
        }
        const token = jwt.sign({
            id:user._id,
            email: user.email,
        },
        JWT_SECRET,{
            expiresIn: "2h",
        });
        res.status(200).redirect('/home')
    }
}
// const verifyUser = async(email, password) => {
//     try {
//         const user = await userCollection.findOne({email}).lean()
//         if(!user){
//             return {status:'error',error:'user not found'} 
//             // return "<script>alert('Email already exists'); window.location.href ='/signup';</script>"
//         }
//         if(await bcrypt.compare(password, user.password)){
//             token = jwt.sign({
//                 id:user._id,
//                 username:user.email, 
//                 // type:'user'
//             },
//             JWT_SECRET,{expiresIn: '2h'})
//             return {status:'ok',data:token}
//         }
//         return {status:'error',error:'invalid password'}
//     } catch (error) {
//         console.log(error);
//         return {status:'error',error:'timed out'}
//     }
// }

// exports.login = async (req, res) => {
//     const {email, password} = req.body;
//     const response = await verifyUser(email, password);
//     if (response.status === 200){
//         res.cookie('token', token, {maxAge: 2 * 60 * 60 * 1000, httpOnly: true});
//         res.redirect('/home');
//     }else{
//         res.json(response);
//     }
// }

// const verifyToken = (token) => {
    // try {
    //     const verify = jwt.verify(token, JWT_SECRET);
    //     if (verify.type === 'user') {
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }catch (e) {
    //     console.log(JSON.stringify(error),"error");
    //     return false;
    // }
// }

exports.home = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token){
        res.status(401).json({message:Unauthorized});
    }
    const decodeToken = jwt.verify(token, "createdbyrifna");
    const user = await userCollection.findById(decodeToken.id);
    
    res.render('home');
}

exports.dashboard = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token){
        res.status(401).json({message:Unauthorized});
    }
    const decodeToken = jwt.verify(token, "createdbyrifna");
    const admin = await adminCollection.findById(decodeToken.id);
    
    res.render('dashboard');
}
