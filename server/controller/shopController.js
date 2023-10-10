// const { log } = require('handlebars');
// const shopdb = require('../models/shopModel');

// const multer = require('multer');
// // const GridFsStorage = require("multer-gridfs-storage");


// // // set storage
// let storage = multer.diskStorage({
//     destination:function(req,file, cb){
//         cb(null,'./uploads')
//     },
//     filename:function(req,file,cb){
//         const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

//         cb(null,file.filename + '_'+ Date.now() + ext);
//     }
// })

// exports.upload = multer({
//     storage:storage
// }).single('shopImg');

// // module.exports = multer({storage})

// exports.create = (req, res) =>{
//     try {
//        const shopData = new shopdb({
//         name: req.body.name,
//         openingTime: req.body.openingTime,
//         closingTime: req.body.closingTime,
//         shopImg: req.file.filename,
//         address: req.body.address,
//        })
//        shopData.save((err) =>{
//         if(err){
//             res.json({message: err.message, type:'danger'});
//         }else{
//             req.session.message = {
//                 type:'success',
//                 message: 'New shop added Successfully'
//             };
//             res.redirect('/shop');
//         }
//        });
       
        
//     } catch (error) {
        
//         res.status(500).send({
//             message:error.message || "Some error occured while creating a create operation"
//         });
//     }
    
// }

const { log } = require('handlebars');
const Shopdb = require('../models/shopModel')
const multer = require('../middlewares/multer');

exports.create = async (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    console.log(req.body);
    const shopData = new Shopdb({
    name: req.body.name,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    shopImg: req.body.shopImg,
    address: req.body.address,
  });

  const savedShop = await shopData.save();
  res.redirect('/shop');
};