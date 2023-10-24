
const { log } = require('handlebars');
const Shopdb = require('../models/shopModel');
const cloudinary = require('../services/cloudinary');
const path = require('path')
const multer = require('multer');

// accessing multer middleware storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname.split('.').pop())
  },
});

const upload = multer({ storage: storage });

// create new shop
exports.create = async (req, res) => {
  upload.single('shopImg')(req, res, async (err) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (!req.body) {
      res.status(400).send({ message: 'Content can not be empty' });
      return;
    }
    const { name, openingTime, closingTime, address } = req.body;
    const shopImg = req.file.path;

    cloudinary.uploader.upload(shopImg, (cloudinaryErr, result) => {
      if (cloudinaryErr) {
        res.status(500).send({ message: cloudinaryErr.message });
        return;
      }
      // console.log(result);
      const shop = new Shopdb({
        name,
        openingTime,
        closingTime,
        shopImg: result.secure_url,
        address,
      });
      shop.save()
      .then(savedShop => {
        // console.log(savedShop);
        res.redirect('/shop');
       })
      .catch(saveErr => {
        // console.log('hi')
        res.status(500).send({ message: saveErr.message });
      });
    });
  });
};


// retrieve and return all shop or  retrieve and return a single shop 
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    Shopdb.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found shop with id" + id })
      } else {
        res.send(data)
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error in retrieving shop with id" + id })
    })
  } else {
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


// Update a new identified shop by  shop id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" })
  }
  const id = req.params.id;
  Shopdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `User with ${id} is not found` })
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Update user information" })
    })
}




exports.delete = (req, res) => {
  const id = req.params.id;

  Shopdb.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Shop with ${id} is not found` })
      } else {
        res.send({
          message: "Shop is deleted successfully"
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete shop with id " + id
      })
    })

}



