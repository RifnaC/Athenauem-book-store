const jwt = require('jsonwebtoken');
const admin = require('../models/model');

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.admin && req.admin.isSuperAdmin) {
        // If the user is a super-admin, they have access
        return next();
    } else {
        // If the user is not a super-admin, deny access
        return res.status(403).json({ message: 'Permission denied. Admin access required.' });
    }
};

// Middleware to check if the user is a super-admin
exports.isSuperAdmin = (req, res, next) => {
    if (req.admin && req.admin.isSuperAdmin) {
        // If the user is a super-admin, they have access
        return next();
    } else {
        // If the user is not a super-admin, deny access
        return res.status(403).json({ message: 'Permission denied. Super-admin access required.' });
    }
};



