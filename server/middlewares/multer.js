const multer = require('multer');
// const GridFsStorage = require("multer-gridfs-storage");


// // set storage
let storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '_'+ Date.now() + "_"+file.originalname);
    },
})

exports.upload = multer({
    storage:storage,
}).single('shopImg');

module.exports = multer({storage})