const { log } = require('handlebars');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

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

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }else{
        res.status(403).render('error', {adminAuthorization: true });
    }
    
  };
  
  // Middleware to check if the user is a vendor
  exports.isVendor = (req, res, next) => {
    if (req.user && req.user.role === 'vendor') {
      return next();
    }
    res.status(403).render('error',{ vendorAuthorization : true });
  };
