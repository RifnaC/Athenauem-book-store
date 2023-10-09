const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    }
})

const Admindb = mongoose.model('Admin', schema);

module.exports = Admindb;