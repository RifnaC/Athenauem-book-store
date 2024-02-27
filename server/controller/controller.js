const { log } = require('handlebars');
const Admindb = require('../models/model');
const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

// ***********************Admin Management********************************
// create and save new admin
exports.create = async (req, res) => {
    if (!req.body) {
        res.status(400).send(notification('Content can not be empty'));
        return;
    }
    try {
        // Check if the email already exists in the database
        const existingAdmin = await Admindb.findOne({ email: req.body.email });
        const existingEmail = await user.findOne({ email: req.body.email });
        if (existingAdmin || existingEmail) {
            // Display an alert when email is already taken.
            res.status(200).send(notification('Email already exists'));
            return;
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const admin = new Admindb({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        // save admin in database
        const savedAdmin = await admin.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send(notification("Some error occured while creating a create operation"));
    }
};

// retrieve and return all admin or  retrieve and return a single admin 
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Admindb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send(notification("Not found admin with id" + id));
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send(notification("Error in retrieving admin with id" + id));
            })
    } else {
        Admindb.find()
            .then(admin => {
                res.send(admin)
            })
            .catch(err => {
                res.status(500).send(notification("Some error occured while retriving admin information"));
            })
    }
}

exports.findAll = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Admindb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send(notification("Not found admin with id" + id));
                } else {
                    res.json(data)
                }
            })
            .catch(err => {
                res.status(500).send(notification("Error in retrieving admin with id" + id));
            })
    } else {
        Admindb.find()
            .then(admin => {
                res.send(admin)
            })
            .catch(err => {
                res.status(500).send(notification("Some error occured while retriving admin information"));
            })
    }
}

// Update a new identified admin by  admin id
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send(notification("Data to update can not be empty"));
    }
    const id = req.params.id;
    Admindb.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            return res.status(404).send(notification(`User with ${id} is not found`));
        } else {
            res.send(data);
        }
    })
        .catch(err => {
            res.status(500).send(notification("Error Update user information"));
        })
}

//Delete a admin with specified admin id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Admindb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send(notification(`admin with ${id} is not found`));
            } else {
                res.send({
                    message: "Admin is deleted successfully"
                })
            }
        })
        .catch(err => {
            res.status(500).send(notification("Could not delete admin with id " + id));
        })
}