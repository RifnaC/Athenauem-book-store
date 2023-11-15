const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const signToken = id => {
    return jwt.sign({id}, JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

exports.home = async (req, res) => {
    // const token = req.headers['authorization'];
    // if (!token){
    //     res.status(401).json({message:Unauthorized});
    // }
    // const decodeToken = jwt.verify(token, JWT_SECRET);
    // const user = await userCollection.findById(decodeToken.id);
    res.render('home');
}


// exports.dashboard = async (req, res) => {
//     // const token = req.headers['authorization'];

//     // if (!token) {
//     //     res.status(401).json({ message: "Unauthorized" });
//     //     return;
//     // }
//     try {
//         // const decodeToken = jwt.verify(token, JWT_SECRET);
//         // const admin = await adminCollection.findById(decodeToken.id);

//         // if (!admin) {
//         //     res.status(404).json({ message: "Admin not found" });
//         //     return;
//         // }
//         // if (admin.isSuperAdmin) {
//         //     res.render('dashboard');
//         // } else {
//             res.render('dashboard');
//         // }
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };


// };

    // const token = req.session.token;

    // // Log the token for debugging
    // console.log('Stored Token:', token);

    // if (!token) {
    //     // Redirect to the login page if no token is present
    //     return res.redirect('/login');
    // }

//     // ... (existing code)
// };

//     const testToken = req.headers.authorization;
//     console.log(testToken + ' dddddddddddddddddddddddddddddddd');
//     if (!testToken) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     let token;
//     if(testToken && testToken.startsWith('bearer')){
//       token = testToken.split(' ')[1];
//     }
//     console.log(token + "hhhhhhh");
//     try {
//         const decodedToken = await util.promisify(jwt.verify)(token, JWT_SECRET); 
//         console.log(decodedToken + ' decodedToken');
//         req.userId = decoded.userId;
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Invalid token' });
//     }


exports.authMiddleware = async(req, res, next) => {
     const token = req.session.token;

    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token Verification Error:', err);
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}