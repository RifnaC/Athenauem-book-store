const { log } = require('handlebars');
const bannerCollection = require('../models/bannerModel');
const cloudinary = require('../services/cloudinary');
const path = require('path')
const multer = require('multer');
const { banner } = require('../services/render');
const { request } = require('http');
const { response } = require('express');


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

// create new banner
exports.create = async (req, res) => {
  upload.single('bannerImg')(req, res, async (err) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (!req.body) {
      res.status(400).send({ message: 'Content can not be empty' });
      return;
    }
    const { name,  shop,  type, categoryId, productId} = req.body;
    const bannerImg = req.file.path;
    cloudinary.uploader.upload(bannerImg, (cloudinaryErr, result) => {
      if (cloudinaryErr) {
        res.status(500).send({ message: cloudinaryErr.message });
        return;
      }
      const banner = new bannerCollection({
        name,
        shop, 
        type, 
        categoryId, 
        productId,
        bannerImg: result.secure_url,
        cloudinaryId: result.public_id,
      });
      banner.save()
      .then(savedBanner => {
        console.log(savedBanner);
        res.redirect('/banner');
       })
      .catch(saveErr => {
        res.status(500).send({ message: saveErr.message });
      });
    });
  });
};


// retrieve and return all banner or  retrieve and return a single banner 
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    bannerCollection.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found banner with id" + id })
      } else {
        res.send(data)
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error in retrieving banner with id" + id })
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
      res.status(500).send({ message: err.message || "Some error occurred while retrieving banner information" });
    });
  }
}

exports.update = async(req, res) => {
    upload.single('bannerImg', {name:"bannerImg"})(req, res, async (err) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        try {
            const bannerId = req.params.id;
            const banner = await bannerCollection.findById(bannerId);
            // console.log(shop)
            if (!banner) {
                return res.status(404).json({ message: 'Shop not found' });
            }   
            // console.log(req.file)
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

            // Save the banner changes to the database  
            const savedBan = await banner.save();
            // Return the updated banner data
            return res.status(200).json(banner);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred while updating the banner' });
        }
    })
};

exports.delete = (req, res) => {
    const id = req.params.id;
    bannerCollection.findById(id)
    .then(banner => {
        if (!banner) {
            res.status(404).send({ message: `Banner with ${id} is not found` });
        } 
        else {
            // Delete the banner image from Cloudinar
            cloudinary.uploader.destroy(banner.cloudinaryId, (cloudinaryErr, result) => {
                if (cloudinaryErr) {
                    console.error('Error deleting image from Cloudinary:', cloudinaryErr);
                }
                // Regardless of Cloudinary deletion status, proceed to delete the banner data
                bannerCollection.findByIdAndDelete(id)
                .then(() => {
                    res.send({
                        message: "Banner is deleted successfully"
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Could not delete Banner with id " + id
                    });
                });
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error finding banner with id " + id
        });
    });
}
