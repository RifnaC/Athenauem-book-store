const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const axios = require('axios');


exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({message:"Data to update can not be empty"})
    }
    const id = req.params.id;
    Admindb.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(data =>{
        if(!data){
            return res.status(404).send({message:`User with ${id} is not found`})
        }else{
            res.send(data);
        }
    })
    .catch(err => {
        res.status(500).send({message: "Error Update user information"})
    })
}

exports.editUser = async(req, res)=>{
    const id = req.user.id;
    const admin = await adminCollection.findById(id);
    const name = admin.name.split(" ")[0];
    const userData = await userCollection.findById(req.query.id);
    console.log(userData);
    res.render('editUser', {user:userData, admin: name});
}

    
    

