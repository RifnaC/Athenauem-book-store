const { log } = require('handlebars');
const Shopdb = require('../models/shopModel');
const books = require('../models/products');
const cloudinary = require('../services/cloudinary');
const path = require('path')
const multer = require('multer');
const { request } = require('http');
const { response } = require('express');
const mongoose = require('mongoose');

// access multer middleware storage
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
      const shop = new Shopdb({
        name,
        openingTime,
        closingTime,
        shopImg: result.secure_url,
        cloudinaryId: result.public_id,
        address,
      });
      
      shop.save()
      .then(savedShop => {
        res.redirect('/shop');
       })
      .catch(saveErr => {
        res.status(500).send({ message: saveErr.message });
      });
    });
  });
};

// retrieve and return all shop or retrieve and return a single shop 
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

// Update a new identified shop by shop id
exports.update = async(req, res) => {
  upload.single('shopImg', {name:"shopImg"})(req, res, async (err) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
  try {
    const shopId = req.params.id;
    const shop = await Shopdb.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    // console.log(req.file)
    // Check if a new file is being uploaded
    if (req.file) {
      // Delete the old shop image from Cloudinary
      await cloudinary.uploader.destroy(shop.cloudinaryId);

      // Upload the new shop image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Update the shop image URL and Cloudinary ID
      shop.shopImg = result.secure_url;
      shop.cloudinaryId = result.public_id;
    }

    // Update other shop details based on your form data
    shop.name = req.body.name || shop.name;
    shop.openingTime = req.body.openingTime || shop.openingTime;
    shop.closingTime = req.body.closingTime || shop.closingTime;
    shop.address = req.body.address || shop.address;

    // Save the shop changes to the database
    await shop.save();
    // Return the updated shop data
    return res.status(200).json(shop);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating the shop' });
  }
})
};

// Delete the shop
exports.delete = (req, res) => {
  const id = req.params.id;
  Shopdb.findById(id)
  .then(shop => {
    if (!shop) {
      res.status(404).send({ message: `Shop with ${id} is not found` });
    } else {
      // Delete the shop image from Cloudinary
      cloudinary.uploader.destroy(shop.cloudinaryId, (cloudinaryErr, result) => {
        if (cloudinaryErr) {
          console.error('Error deleting image from Cloudinary:', cloudinaryErr);
        }
        // Regardless of Cloudinary deletion status, proceed to delete the shop data
        Shopdb.findByIdAndDelete(id)
        .then(() => {
          res.send({
            message: "Shop is deleted successfully"
          });
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete shop with id " + id
          });
        });
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error finding shop with id " + id
    });
  });
}
