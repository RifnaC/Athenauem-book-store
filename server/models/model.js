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
        enum: ['Active', 'Pending', 'Block'],
        default: 'Pending',
    },
    role: { 
        type: String, 
        enum: ['vendor', 'admin'], 
        default: 'vendor' 
    }
})

const Admindb = mongoose.model('Admin', schema);
module.exports = Admindb;

