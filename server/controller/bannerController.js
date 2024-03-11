const { log } = require('handlebars');
const bannerCollection = require('../models/bannerModel');
const Shop = require('../models/shopModel')
const cloudinary = require('../services/cloudinary');
const path = require('path')
const multer = require('multer');
const { banner } = require('../services/render');
const { request } = require('https');
const { response } = require('express');

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
        confirmButtonColor: '#15877C',
      }).then((result) => {
        history.back();
      })
  </script>
  </body>
  <!-- JavaScript Libraries -->
  
  </html>`
}

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


exports.create = async (req, res) => {
  upload.single('bannerImg')(req, res, async (err) => {
    if (err) {
      res.status(500).send(notification('Something went wrong, please try again later'));
      return;
    }
    if (!req.body) {
      res.status(400).send(notification('Content can not be empty'));
      return;
    }
    const { name, shop, type, categoryId, productId, description } = req.body;
    const bannerImg = req.file.path;
    cloudinary.uploader.upload(bannerImg, async (cloudinaryErr, result) => {
      if (cloudinaryErr) {
        res.status(500).send(notification('Cannot upload content into cloudinary'));
        return;
      }

      try {
        // Count the number of existing records
        const count = await bannerCollection.countDocuments({});

        if (count >= 3) {
          // Find and delete the oldest record
          const oldestBanner = await bannerCollection.findOneAndDelete({}, { sort: { _id: 1 } });

          // Delete the old image from Cloudinary
          await cloudinary.uploader.destroy(oldestBanner.cloudinaryId);

          // Create and save the new banner
          const banner = new bannerCollection({
            name,
            shop,
            type,
            categoryId,
            productId,
            bannerImg: result.secure_url,
            cloudinaryId: result.public_id,
            description,
          });

          const savedBanner = await banner.save();
          res.redirect('/banner');
        } else {
          // Create and save the new banner if the count is less than 3
          const banner = new bannerCollection({
            name,
            shop,
            type,
            categoryId,
            productId,
            bannerImg: result.secure_url,
            cloudinaryId: result.public_id,
            description,
          });

          const savedBanner = await banner.save();
          res.redirect('/banner');
        }
      } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
      }
    });
  });
};

// retrieve and return all banner or  retrieve and return a single banner 
exports.find = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    bannerCollection.findById(id)
      .then(data => {
        if (!data) {
          res.status(404).send(notification("Not found banner with id" + id ));
        } else {
          res.send(data)
        }
      })
      .catch(err => {
        res.status(500).send(notification("Error in retrieving banner with id" + id));
      })
  } else {
    bannerCollection.find()
      .then(banner => {
        // If it's an API request, send JSON data
        if (req.path === '/api/banner') {
          res.json(banner);
        } else {
          // If it's a web request, render the "banner" page with the data
          res.render('banner', { banners: banner });
        }
      })
      .catch(err => {
        res.status(500).send(notification("Some error occurred while retrieving banner information"));
      });
  }
}

exports.update = async (req, res) => {
  upload.single('bannerImg', { name: "bannerImg" })(req, res, async (err) => {
    if (err) {
      res.status(500).send(notification("Some error occurred while updating banner"));
      return;
    }
    try {
      const bannerId = req.params.id;
      const banner = await bannerCollection.findById(bannerId);
      if (!banner) {
        return res.status(404).send(notification('Banner not found'));
      }
      // Check if a new file is being uploaded
      if (req.file) {
        // Delete the old banner image from Cloudinary
        await cloudinary.uploader.destroy(banner.cloudinaryId);

        // Upload the new banner image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Update the banner image URL and Cloudinary ID
        banner.bannerImg = result.secure_url;
        banner.cloudinaryId = result.public_id;
      }
      // Update other banner details based on your form data
      banner.name = req.body.name || banner.name;
      banner.shop = req.body.shop || banner.shop
      banner.type = req.body.type || banner.type;
      banner.categoryId = req.body.categoryId || banner.categoryId;
      banner.productId = req.body.productId || banner.productId;
      banner.description = req.body.description || banner.description

      // Save the banner changes to the database  
      const savedBan = await banner.save();
      // Return the updated banner data
      return res.status(200).json(banner);
    } catch (error) {
      return res.status(500).send(notification('An error occurred while updating the banner'));
    }
  })
};

exports.delete = (req, res) => {
  const id = req.params.id;
  bannerCollection.findById(id)
    .then(banner => {
      if (!banner) {
        res.status(404).send(notification(`Banner with ${id} is not found`));
      }
      else {
        // Delete the banner image from Cloudinar
        cloudinary.uploader.destroy(banner.cloudinaryId, (cloudinaryErr, result) => {
          if (cloudinaryErr) {
            res.status(400).send(notification('Error deleting image from Cloudinary:'));
          }
          // Regardless of Cloudinary deletion status, proceed to delete the banner data
          bannerCollection.findByIdAndDelete(id)
            .then(() => {
              res.status(200).send(notification("Banner is deleted successfully"));
            })
            .catch(err => {
              res.status(500).send(notification("Could not delete Banner with id " + id));
            });
        });
      }
    })
    .catch(err => {
      res.status(500).send(notification("Error finding banner with id " + id));
    });
}
