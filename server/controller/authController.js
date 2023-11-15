const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const session = require('express-session');
const JWT_SECRET = process.env.JWT_SECRET;
// ***********************user Management********************************
// Register and save new user
const signToken = id => {
    return jwt.sign({id}, JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
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
            password:  hashedPassword
        });
        const token = signToken(user._id);
        // save user in database
        const savedUser = await user.save();
        if(token){
            res.redirect('/home');
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
        const user = await userCollection.findOne({
            email: req.body.email
        });
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
            isSuperAdmin: admin ? admin.isSuperAdmin:false,
        };
        const token = signToken((user || admin)._id, data);
        console.log(token)
        req.session.token = token;
        if (admin) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/home');
        }
    }catch (e) {
        console.error(e);
        res.status(500).send({message:'Internal Server Error'});
    }   
}

exports.logout = async(req, res) => {
    // res.clearCookie('jwt'); // Clear the JWT cookie or remove the token from wherever it's stored

    const token = req.headers['authorization'];
    const user = await userCollection.findOne({ token });
  
    if (user) {
      user.token = null;
      await user.save();
      res.redirect('/login');
    } else {
      res.status(401).json({
        message: 'You are not logged in.'
      });
    }
     // Redirect to the login page or any other desired page
};


//     if(!user) {
//         const admin = await adminCollection.findOne({
//             email: req.body.email
//         })
//         if(!admin){
//             res.status(404).send({message: "This email is not found."});
//         }
//         const adminToken = jwt.sign({
//             id:admin._id,
//             email: admin.email,
//             isSuperAdmin: admin.isSuperAdmin,
//         },
//         JWT_SECRET,{
//         expiresIn: "2h",
//         });
//         let result = {
//             email: admin.email,
//             token: `Bearer ${adminToken}`,
//             expiresIn: 168,
//           };
      
//         if (admin.isSuperAdmin) {
//             res.redirect('/dashboard');
//         } else {
//             res.redirect('/shop');
//         }
//           return res.status(200).redirect('/dashboard');
//         console.log(adminToken);
//     }
//     else{
//         const ispswdValid = await bcrypt.compare(req.body.password, user.password);
//         if(!ispswdValid){
//             res.status(401).send({message: "Invalid password."});
//         }
//         const token = jwt.sign({
//             id:user._id,
//             email: user.email,
//             isSuperAdmin: user.isSuperAdmin,
//         },
//         JWT_SECRET,{
//             expiresIn: "2h",
//         });
//         res.status(200).redirect('/home')
//     }
// }

