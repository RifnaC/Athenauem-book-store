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
    },
    role:{
        type: String,
        default: 'User'
    },
    status:{
        type: String,
        default: 'Active',
    },
    gender:{
        type: String,
        default: 'Male',
    },
    addresses:[
        {
            fullName:String,
            phone:Number,
            address:String,
            city:String,
            district:String,
            state:String,
            pincode:Number,
        }
    ],
    otp:{
        type: Number,
    },
    otpExpiry:{
        type: Date,      
    }
})

const user = mongoose.model('users', userSchema);
module.exports = user;

