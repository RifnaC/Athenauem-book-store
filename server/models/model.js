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
    isSuperAdmin:{
        type:Boolean,
        default:false
    },
    tokens:[
        {
            adminToken: {
                type:String,
                required: true,
            },
        },
    ]
})

const Admindb = mongoose.model('Admin', schema);
module.exports = Admindb;

