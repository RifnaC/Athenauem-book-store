const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel');
const { token } = require('morgan');
const saltRounds = 10;

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
        if (existingUser){ 
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

const verifyUser = async(email, password) => {
    try {
        const user = await userCollection.findOne({email}).lean()
        if(!user){
            return {status:'error',error:'user not found'}
        }
        if(await bcrypt.compare(password, user.password)){
            token = jwt.sign({id:user._id,
            username:user.email, type:'user'},
            JWT_SECRET,{expiresIn: '2h'})
            return {status:'ok',data:token}
        }
        return {status:'error',error:'invalid password'}
    } catch (error) {
        console.log(error);
        return {status:'error',error:'timed out'}
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    const response = await verifyUser(email, password);
    if (response.status === 200){
        res.cookie('token', token, {maxAge: 2 * 60 * 60 * 1000, httpOnly: true});
        res.redirect('/home');
    }else{
        res.json(response);
    }
}

const verifyToken = (token) => {
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        if (verify.type === 'user') {
            return true;
        }else{
            return false;
        }
    }catch (e) {
        console.log(JSON.stringify(error),"error");
        return false;
    }
}

exports.home = async (req, res) => {
    const {token}= req.cookies;
    if(verifyToken(token)){
        return res.render('home');
    }else{
        res.redirect('/login')
    }
}

