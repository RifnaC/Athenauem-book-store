const mongoose = require('mongoose');
const discountSchema = new mongoose.Schema({
code:{
    type: String,
    required: true,
    unique: true,
},
isPercent:{
    type: Boolean,
    required: true,
    default: true
},
amount:{
    type:Number,
    required: true
}, 
expireDate:{
    type:String,
    require: true
},
isActive:{
    type:Boolean,
    require: true,
    default: true,
},
});

discountSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
    this.created_at = currentDate;
    }
    next();
    });
    var Discounts = mongoose.model('Offers', discountSchema);
    module.exports = Discounts;