const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
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
        const adminToken = jwt.sign({
            id:admin._id,
            email: admin.email,
            isSuperAdmin: admin.isSuperAdmin,
        },
        JWT_SECRET,{
        expiresIn: "2h",
        });
        let result = {
            email: admin.email,
            token: `Bearer ${adminToken}`,
            expiresIn: 168,
          };
      
        if (admin.isSuperAdmin) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/shop');
        }
        //   return res.status(200).redirect('/dashboard');
        // console.log(adminToken);
    }
    else{
        const ispswdValid = await bcrypt.compare(req.body.password, user.password);
        if(!ispswdValid){
            res.status(401).send({message: "Invalid password."});
        }
        const token = jwt.sign({
            id:user._id,
            email: user.email,
            isSuperAdmin: user.isSuperAdmin,
        },
        JWT_SECRET,{
            expiresIn: "2h",
        });
        res.status(200).redirect('/home')
    }
}
