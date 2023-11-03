const mongoose = require('mongoose');
// user collection 
const userSchema = new mongoose.Schema({
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
    }
})

const user = mongoose.model('users', userSchema);
module.exports = user;

