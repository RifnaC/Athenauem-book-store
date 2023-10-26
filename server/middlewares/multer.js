const multer = require('multer');

// access multer middleware storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname.split('.').pop())
    },
  }); 
  
 exports.upload = multer({ storage: storage });

