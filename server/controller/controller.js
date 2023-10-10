const { log } = require('handlebars');
const Admindb = require('../models/model');
const bcrypt = require('bcrypt');
const saltRounds = 10; 


// create and save new admin
exports.create = async(req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    try{
        // Check if the email already exists in the database
        const existingAdmin = await Admindb.findOne({ email: req.body.email });
        if (existingAdmin){ 
            // Display an alert when email is already taken.
            res.status(200).send(
                "<script>alert('Email already exists'); window.location.href = '/addAdmin';</script>"
              );
              return;
        }
         // Hash the password
         const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const admin = new Admindb({
                name: req.body.name,
                email: req.body.email,
                password:  hashedPassword
            });
            // save admin in database
            const savedAdmin = await admin.save();
            res.redirect('/admin');
    }catch(err){
        res.status(500).send({
            message:err.message || "Some error occured while creating a create operation"
        });
    }
};

// retrieve and return all admin or  retrieve and return a single admin 
exports.find = (req, res) => {
    if(req.query.id){
        const id = req.query.id;
        Admindb.findById(id)
        .then(data => {
            if(!data){
                res.status(404).send({message:"Not found admin with id" + id})
            }else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({message:"Error in retrieving admin with id" + id})
        })
    }else{
        Admindb.find()
    .then(admin => {
        res.send(admin)
    })
    .catch(err => {
        res.status(500).send({message:err.message ||"Some error occured while retriving admin information" })
    })
    }

}



// Update a new identified admin by  admin id
exports.update = (req, res) => {
   if(!req.body){
        return res.status(400).send({message:"Data to update can not be empty"})
    }
    const id = req.params.id;
    Admindb.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(data =>{
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

exports.update_password = async (req, res) => {
    try {
        // Extract data from the request body
        const { id, oldPassword,confirmPassword } = req.body;
        const newPassword = req.body.newPassword;



        // Validate the old password (You should check if it matches the stored hashed password)
        const admin = await Admindb.findById(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

        
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        // Validate that the new password and confirmation match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirmation do not match' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin's password in the database
        await admin.findByIdAndUpdate(id, { password: hashedPassword });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




//Delete a admin with specified admin id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Admindb.findByIdAndDelete(id)
    .then(data => { 
        if(!data){
            res.status(404).send({message: `admin with ${id} is not found`})
        }else{
            res.send({
                message: "Admin is deleted successfully"
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message:"Could not delete admin with id "+ id
        })
    })
    
}