// const jwt = require('jsonwebtoken');
// const jwtToken = process.env.JWT_SECRET;

// // async function authMiddleware(req, res, next) {
// //   const testToken = req.headers.authorization;

// //   if (!testToken) {
// //     return res.status(401).json({ message: 'Unauthorized' });
// //   }
// //   let token;
// //   if(testToken && testToken.startsWith('bearer')){
// //     token = testToken.split(' ')[1];
// //   }
// //   console.log(token + "hhhhhhh");
// //   try {
// //     const decoded = jwt.verify(token, jwtToken);
// //     req.userId = decoded.userId;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ message: 'Invalid token' });
// //   }
// // }


// exports.authMiddleware = async(req, res, next) => {
//   // Middleware to check for a valid JWT token in the session

//   const token = req.session.token;

//   if (!token) {
//       // Redirect to the login page if no token is present
//       return res.redirect('/login');
//   }

//   // Verify the token
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//       if (err) {
//           // Invalid token, redirect to login
//           console.error('Token Verification Error:', err);
//           return res.redirect('/login');
//       }

//       // Token is valid, continue to the protected route
//       req.user = user;
//       next();
//   });
// }
