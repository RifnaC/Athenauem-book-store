const { log } = require('handlebars');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');
const Users = require('../models/userModel');

exports.checkout = async(req, res) => {
    const id = req.user.id;
    const user = await Users.findById(id);
    const addres = user.addresses;
    res.render('checkout', {user: user, address: addres[0]});
}

exports.changeAddress = async(req, res) => {
    const id = req.user.id;
    const {fullName, phone, address, city, district, state, pincode} = req.body;
    const adrs = await Users.findI({_id:id}, {addresses: 1})
    console.log(adrs);
    // const user = await Users.findByIdAndUpdate({_id:id}, {$push:{
    //     "addresses": {
    //         fullName:req.body.fullName,
    //         phone:req.body.phone,
    //         address:req.body.address,
    //         city:req.body.city,
    //         district:req.body.district,
    //         state:req.body.state,
    //         pincode:req.body.pincode,
    //     }
    // }});
    user.save().then(()=>{
        res.render('profile');
    }).catch(err=>{
        console.log(err);
    })
    res.render('checkout', {user: user, address: address});
}