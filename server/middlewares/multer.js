const multer = require('multer');


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        console.log('hhhh',file);
        cb(null, '../uploads')
    }
})

const upload = multer({storage: storage});


