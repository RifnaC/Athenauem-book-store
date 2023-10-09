const Admindb = require('../models/model');




// create and save new admin
exports.create = (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    const admin = new Admindb({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    // save admin in database
    admin
    .save(admin)
    .then(data => {
        // res.send(data)
        res.redirect('/admin')
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occured while creating a create operation"
        });
    })
}

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

//Update a new identified admin by  admin id
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