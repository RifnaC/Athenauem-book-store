const { log } = require('handlebars');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function notification(msg) {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8">
      <title>Atheneuam - Book Colleciton</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport">
      <meta content="" name="keywords">
      <meta content="" name="description">
  
      <!-- Favicon -->
      <link href="img/book collection 0.png" rel="icon">
  
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  </head>
  <body>
  <script> 
      Swal.fire({
          imageUrl: "/img/favicon.png",
          title: "Atheneuam",        
          imageWidth: 120,
          imageHeight: 80,
          imageAlt: "Atheneuam Logo",
          text: "${msg}",   
          confirmButtonText: 'Ok',     
          confirmButtonColor: '#15877C',
      }).then(()=>{
        window.location.href = '/login';
      })
  </script>
  </body>
  <!-- JavaScript Libraries -->
  </html>`
}

exports.authMiddleware = async(req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token Verification Error:', err);
            return res.send(notification("Your Token has been Expired, please login again!"));
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
