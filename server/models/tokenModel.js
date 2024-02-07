const { Timestamp } = require('mongodb');
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User' || 'Admin' 
    },
    token: String,
    createdAt: { 
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = mongoose.model('Token', tokenSchema);