const { log } = require('handlebars');
const genreCollection = require('../models/categoryModel');
const { category } = require('../services/render');

// create and save new shop
exports.create = async (req, res) => {
    if(!req.body){
        res.status(400).send({message: 'Content can not be empty'})
        return;
    }
    // console.log(req.body);
    const genre = new genreCollection({
        genre: req.body.genre,
        totalBooks: req.body.totalBooks,
        totalEarnings: req.body.totalEarnings,
    });

  const savedGenre = await genre.save(); 
  console.log(savedGenre);
  res.redirect('/category');
};

// retrieve and return all shop or  retrieve and return a single shop 
exports.find = (req, res) => {
  if(req.query.id){
      const id = req.query.id;
      genreCollection.findById(id)
      .then(data => {
          if(!data){
              res.status(404).send({message:"Not found category with id" + id})
          }else{
              res.send(data)
          }
      })
      .catch(err => {
          res.status(500).send({message:"Error in retrieving category with id" + id})
      })
  }else{
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
exports.update = (req, res) => {
  if(!req.body){
       return res.status(400).send({message:"Data to update can not be empty"})
   }
   const id = req.params.id;
   genreCollection.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
   .then(data =>{
       if(!data){
           return res.status(404).send({message:`category with ${id} is not found`})
       }else{
           res.send(data);
       }
   })
   .catch(err => {
       res.status(500).send({message: "Error Update user information"})
   })
}




exports.delete = (req, res) => {
  const id = req.params.id;

  genreCollection.findByIdAndDelete(id)
  .then(data => { 
      if(!data){
          res.status(404).send({message: `Genre with ${id} is not found`})
      }else{
          res.send({
              message: "Category is deleted successfully"
          })
      }
  })
  .catch(err => {
      res.status(500).send({
          message:"Could not delete Category with id "+ id
      })
  })
  
}
