const { log } = require('handlebars');
const genreCollection = require('../models/categoryModel');
const { category } = require('../services/render');
const cloudinary = require('../services/cloudinary');
const path = require('path')
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
const upload = multer({ storage: storage });

// create and save new shop
exports.create = async (req, res) => {
    upload.single('categoryImg')(req, res, async (err) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        if (!req.body) {
            res.status(400).send({ message: 'Content can not be empty' });
            return;
        }
        const { genre, totalBooks, description } = req.body
        const categoryImg = req.file.path;
        cloudinary.uploader.upload(categoryImg, (cloudinaryErr, result) => {
            if (cloudinaryErr) {
                res.status(500).send({ message: cloudinaryErr.message });
                return;
            }
            const category = new genreCollection({
                genre,
                totalBooks,
                description,
                categoryImg: result.secure_url,
                cloudinaryId: result.public_id,
            })
            category.save()
                .then(savedGenre => {
                    res.redirect('/category')
                })
                .catch(saveError => {
                    res.status(500).send({ message: saveError.message });
                })
        })

    });
};

// retrieve and return all shop or  retrieve and return a single shop 
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        genreCollection.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found category with id" + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error in retrieving category with id" + id })
            })
    } else {
        genreCollection.find()
            .then(category => {
                // If it's an API request, send JSON data
                if (req.path === '/api/categories') {
                    res.json(category);
                } else {
                    // If it's a web request, render the "category" page with the data
                    res.render('category', { categories: category });
                }
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Some error occurred while retrieving category information" });
            });
    }
}

// Update a new identified category by  category id
exports.update = async (req, res) => {
    upload.single('categoryImg')(req, res, async (err) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        try {
            const id = req.params.id;
            const genre = await Shopdb.findById(id);
            if (!genre) {
                return res.status(404).json({ message: 'Category not found' });
            }
            // Check if a new file is being uploaded
            if (req.file) {
                // Delete the old shop image from Cloudinary
                await cloudinary.uploader.destroy(genre.cloudinaryId);

                // Upload the new shop image to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);

                // Update the shop image URL and Cloudinary ID
                genre.shopImg = result.secure_url;
                genre.cloudinaryId = result.public_id;
            }

            // Update other shop details based on your form data
            genre.name = req.body.name
            genre.openingTime = req.body.openingTime
            genre.closingTime = req.body.closingTime
            genre.address = req.body.address

            // Save the shop changes to the database
            await genre.save();
            // Return the updated shop data
            return res.status(200).json(genre);
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while updating the Category' });
        }
    })
};

// Delete a category
exports.delete = (req, res) => {
  const id = req.params.id;
  genreCollection.findById(id)
  .then(genre => {
    if (!genre) {
      res.status(404).send({ message: `Category with ${id} is not found` });
    } else {
      // Delete the category image from Cloudinary
      cloudinary.uploader.destroy(genre.cloudinaryId, (cloudinaryErr, result) => {
        if (cloudinaryErr) {
          console.error('Error deleting image from Cloudinary:', cloudinaryErr);
        }
        // Regardless of Cloudinary deletion status, proceed to delete the category data
        genreCollection.findByIdAndDelete(id)
        .then(() => {
          res.send({
            message: "Category is deleted successfully"
          });
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete category with id " + id
          });
        });
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error finding category with id " + id
    });
  });
}


// exports.update = (req, res) => {
//     if(!req.body){
//          return res.status(400).send({message:"Data to update can not be empty"})
//      }
//      const id = req.params.id;
//      genreCollection.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
//      .then(data =>{
//          if(!data){
//              return res.status(404).send({message:`category with ${id} is not found`})
//          }else{
//              res.send(data);
//          }
//      })
//      .catch(err => {
//          res.status(500).send({message: "Error Update user information"})
//      })
//   }

// exports.delete = (req, res) => {
//     const id = req.params.id;
//     genreCollection.findByIdAndDelete(id)
//         .then(data => {
//             if (!data) {
//                 res.status(404).send({ message: `Genre with ${id} is not found` })
//             } else {
//                 res.send({
//                     message: "Category is deleted successfully"
//                 })
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete Category with id " + id
//             })
//         })
// }
