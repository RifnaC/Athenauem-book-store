const { Timestamp } = require('mongodb');
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    adminId: { 
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    token: String,
    createdAt: { 
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60
    },
});

module.exports = mongoose.model('Token', tokenSchema);