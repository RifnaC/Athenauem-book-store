const { log } = require('handlebars');
const Shopdb = require('../models/shopModel');
const books = require('../models/products');
const cloudinary = require('../services/cloudinary');
const path = require('path')
const multer = require('multer');
const { request } = require('http');
const { response } = require('express');
const mongoose = require('mongoose');
const { error } = require('console');

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
      <link href="img/favicon.png" rel="icon">
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
          confirmButtonColor: '#15877C',
        }).then((result) => {
          history.back();
        });
      </script>
    </body>
  <!-- JavaScript Libraries --> 
  </html>`
}

// create new shop
exports.create = async (req, res) => {
  upload.single('shopImg')(req, res, async (err) => {
    if (err) {
      res.status(500).send(notification('Cannot create new shop'));
      return;
    }
    if (!req.body) {
      res.status(400).send(notification('Content can not be empty'));
      return;
    }
    const { name, openingTime, closingTime, address } = req.body;
    const shopImg = req.file.path;
    cloudinary.uploader.upload(shopImg, (cloudinaryErr, result) => {
      if (cloudinaryErr) {
        res.status(500).send(notification('Cannot upload shop image'));
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
          res.status(500).send(notification('Something went wrong, please try again later'));
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
          res.status(404).send(notification("Not found shop with id" + id));
        } else {
          res.send(data)
        }
      })
      .catch(err => {
        res.status(500).send(notification("Error in retrieving shop with id" + id))
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
        res.status(500).send(notification("Some error occurred while retrieving shop information"));
      });
  }
}

// Update a new identified shop by shop id
exports.update = async (req, res) => {
  upload.single('shopImg', { name: "shopImg" })(req, res, async (err) => {
    if (err) {
      res.status(500).send(notification("Some error occurred while updating"));
      return;
    }
    try {
      const shopId = req.params.id;
      const shop = await Shopdb.findById(shopId);
      console.log(shop);
      if (!shop) {
        console.log("dddd",error);
        return res.status(404).send(notification('Shop not found'));
      }
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
      return res.status(500).send(notification('An error occurred while updating the shop'));
    }
  })
};

// Delete the shop
exports.delete = (req, res) => {
  const id = req.params.id;
  Shopdb.findById(id)
    .then(shop => {
      if (!shop) {
        res.status(404).send(notification(`Shop with ${id} is not found`));
      } else {
        // Delete the shop image from Cloudinary
        cloudinary.uploader.destroy(shop.cloudinaryId, (cloudinaryErr, result) => {
          if (cloudinaryErr) {
            console.error('Error deleting image from Cloudinary:', cloudinaryErr);
            res.status(404).send(notification("Error deleting image from Cloudinary"))
          }
          // Regardless of Cloudinary deletion status, proceed to delete the shop data
          Shopdb.findByIdAndDelete(id)
            .then(() => {
              res.send(notification("Shop is deleted successfully"));
            })
            .catch(err => {
              res.status(500).send(notification("Could not delete shop with id " + id));
            });
        });
      }
    })
    .catch(err => {
      res.status(500).send(notification("Error finding shop with id " + id));
    });
}
