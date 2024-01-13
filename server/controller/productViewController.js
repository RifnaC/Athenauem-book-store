const product = require('../models/products');

exports.singleView= async (req, res, next) => {
    const id = req.params.id
    console.log(id)
    res.render('singleProductView')
}