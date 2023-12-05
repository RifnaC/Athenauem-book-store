const mongoose = require('mongoose');
// admin collection 
const schema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        default: 'Active',
    },
    role: { 
        type: String, 
        enum: ['admin', 'superAdmin'], 
        default: 'admin' 
    }
})

const Admindb = mongoose.model('Admin', schema);
module.exports = Admindb;

