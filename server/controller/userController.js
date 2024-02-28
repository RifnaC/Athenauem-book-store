const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const axios = require('axios');

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

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send(notification("Data to update can not be empty"));
    }
    const id = req.params.id;
    userCollection.findByIdAndUpdate(id, req.body, { new: true }).then(data => {
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
// Edit user information
exports.editUser = async (req, res) => {
    try {
        const id = req.user.id;
        const admin = await adminCollection.findById(id);
        const name = admin.name.split(" ")[0];
        const userData = await userCollection.findById(req.query.id);
        res.render('editUser', { user: userData, admin: name });
    } catch (error) {
        res.status(500).send(notification("Something went wrong, please try again later"));
    }
}

// Delete customer information
exports.delete = async (req, res) => {
    const id = req.params.id;
    userCollection.findByIdAndDelete(id).then(data => {
        if (!data) {
            return res.status(404).send(notification(`User with ${id} is not found`));
        } else {
            res.send(notification("User was deleted successfully"));
        }
    })
        .catch(err => {
            res.status(500).send(notification("Could not delete user with id=" + id));
        });
}

exports.userDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const admin = await adminCollection.findById(id);
        const name = admin.name.split(" ")[0];
        const userData = await userCollection.findById(req.query.id);
        console.log(userData);
        res.render('userDetails', { user: userData, admin: name });
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}



