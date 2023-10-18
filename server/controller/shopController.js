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
// const multer = require('../middlewares/multer');

// create and save new shop
exports.create = async (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    // console.log(req.body);
    const shop = new Shopdb({
    name: req.body.name,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    // shopImg: "file:///D:/Rifna/Self%20stack/website/projects/Athenauem-book-store/uploads/"+req.body.shopImg,
    address: req.body.address,
  });

// console.log(shopImg)

  const savedShop = await shop.save(); 
  console.log(savedShop);
  res.redirect('/shop');
};

// retrieve and return all shop or  retrieve and return a single shop 
exports.find = (req, res) => {
  if(req.query.id){
      const id = req.query.id;
      Shopdb.findById(id)
      .then(data => {
          if(!data){
              res.status(404).send({message:"Not found shop with id" + id})
          }else{
              res.send(data)
          }
      })
      .catch(err => {
          res.status(500).send({message:"Error in retrieving shop with id" + id})
      })
  }else{
  Shopdb.find()
  .then(shop => {
    // If it's an API request, send JSON data
    if (req.path === '/api/shops') {
      res.json(shop);
    } else {
      // If it's a web request, render the "shop" page with the data
      res.render('shop', { shops: shop });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving shop information" });
  });
}
}


// Update a new identified admin by  admin id
exports.update = (req, res) => {
  if(!req.body){
       return res.status(400).send({message:"Data to update can not be empty"})
   }
   const id = req.params.id;
   Shopdb.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
   .then(data =>{
       if(!data){
           return res.status(404).send({message:`User with ${id} is not found`})
       }else{
           res.send(data);
       }
   })
   .catch(err => {
       res.status(500).send({message: "Error Update user information"})
   })
}




exports.delete = (req, res) => {
  const id = req.params.id;

  Shopdb.findByIdAndDelete(id)
  .then(data => { 
      if(!data){
          res.status(404).send({message: `Shop with ${id} is not found`})
      }else{
          res.send({
              message: "Shop is deleted successfully"
          })
      }
  })
  .catch(err => {
      res.status(500).send({
          message:"Could not delete shop with id "+ id
      })
  })
  
}



