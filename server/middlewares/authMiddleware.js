// Example using Express and jsonwebtoken
// const jwt = require('jsonwebtoken');

// exports.verifyToken = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(401).json({ message: 'JWT must be provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Invalid JWT' });
//         }
//         req.user = decoded;  // Attach decoded user information to the request
//         next();
//     });
// };

