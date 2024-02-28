const Shopdb = require('../models/shopModel')
const Productdb = require('../models/products');
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

// create and save new product
exports.create = async (req, res) => {
  upload.single('productImg')(req, res, async (err) => {
    if (err) {
      res.status(500).send(notification('Something went wrong, please try again later'));
      return;
    }
    if (!req.body) {
      res.status(400).send(notification('Content can not be empty'));
      return;
    }
    const { bookName, shopId, genre, author, price, quantity, description, originalPrice, discount, stock } = req.body;
    const productImg = req.file.path;
    cloudinary.uploader.upload(productImg, (cloudinaryErr, results) => {
      if (cloudinaryErr) {
        res.status(500).send(notification('Cannot able upload product image in cloudinary'));
        return;
      }
      const product = new Productdb({
        bookName,
        shopId,
        genre,
        author,
        originalPrice,
        discount,
        price: originalPrice - discount,
        quantity,
        description,
        stock: quantity > 0 ? "Availiable" : "Out of stock",
        productImg: results.secure_url,
        cloudinaryId: results.public_id,
      });
      product.save()
        .then(savedProduct => {
          if (!shopId) {
            res.redirect('/products');
          }
          else {
            res.redirect('/books?id=' + shopId);
          }
        })
        .catch(savedErr => {
          res.status(500).send(notification('Something went wrong, please try again later'));
        });
    })
  })
};

// retrieve and return all product or  retrieve and return a single  product
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    Productdb.findById(id)
      .then(data => {
        if (!data) {
          res.status(404).send(notification("Not found product with id" + id));
        } else {
          res.send(data)
        }
      })
      .catch(err => {
        res.status(500).send(notification("Error in retrieving product with id" + id));
      })
  } else {
    Productdb.find()
      .then(book => {
        // If it's an API request, send JSON data
        if (req.path === '/api/products') {
          res.json(book);
        } else {
          // If it's a web request, render the "" page with the data
          // console.log(books);
          res.render('products', { books: book });
        }
      })
      .catch(err => {
        res.status(500).send(notification("Some error occurred while retrieving product information"));
      });
  }
}

// Update a new identified book by book id
exports.update = async (req, res) => {
  // Middleware for handling file uploads 
  upload.single("productImg")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(notification('Cannot upload product image'));
    }
    try {
      const bookId = req.params.id;
      const book = await Productdb.findById(bookId);
      console.log(book);

      if (!book) {
        return res.status(404).json(notification('Book not found'));
      }

      if (req.file) {
        // Delete the old book image from Cloudinary
        await cloudinary.uploader.destroy(book.cloudinaryId);

        // Upload the new book image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Update the book image URL and Cloudinary ID
        book.productImg = result.secure_url;
        book.cloudinaryId = result.public_id;
      }

      // Update other book details based on your form data
      book.bookName = req.body.bookName || book.bookName;
      book.genre = req.body.genre || book.genre;
      book.author = req.body.author || book.author;
      book.price = req.body.price || book.price;
      book.quantity = req.body.quantity || book.quantity;
      book.description = req.body.description || book.description;
      book.shopId = req.body.shopId || book.shopId;
      book.originalPrice = req.body.originalPrice || book.originalPrice;
      book.discount = req.body.discount || book.discount;
      book.stock = book.quantity > 0 ? "availiable" : "out of stock";

      // Save the updated book to the database
      await book.save()
      return res.status(200).json(book);
    } catch (err) {
      console.error(err);
      return res.status(500).send(notification('An error occurred while updating the book'));
    }
  });
}

// Delete the book by its id
exports.delete = (req, res) => {
  const id = req.params.id;
  Productdb.findById(id)
    .then(book => {
      if (!book) {
        res.status(404).send(notification(`Book with id ${id} not found`));
      } else {
        cloudinary.uploader.destroy(book.cloudinaryId, (cloudinaryErr, result) => {
          if (cloudinaryErr) {
            res.send(notification('Error deleting book from cloudinary'));
          }
          Productdb.findByIdAndDelete(id)
            .then(() => {
              res.send(notification('Book deleted successfully'));
            })
            .catch(err => {
              res.status(500).send(notification(`Could not delete book with id ${id}`));
            })
        });
      }
    })
    .catch(err => {
      res.status(500).send(notification("Error finding book with id " + id));
    })
}