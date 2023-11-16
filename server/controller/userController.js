const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const util = require('util');
// const saltRounds = 10;
// const JWT_SECRET = process.env.JWT_SECRET;


// exports.home = async (req, res) => {
//     res.render('home');
// }

// exports.authMiddleware = async(req, res, next) => {
//      const token = req.session.token;

//     if (!token) {
//         return res.redirect('/login');
//     }
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error('Token Verification Error:', err);
//             return res.redirect('/login');
//         }
//         req.user = user;
//         next();
//     });
// }

// exports.dashboard = async (req, res) => {
//         try {
//             // Assuming user data is available in req.user or req.session.user
//             const admin = await adminCollection.findOne({ where: { email: email } });
//             console.log(admin)
//             if (!admin) {
//                 // Redirect to login if user data is not available
//                 return res.redirect('/login');
//             }
    
//             // Render the profile view and pass the user data
//             res.render('dashboard', { admin });
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Internal Server Error');
//         }
    
// }



