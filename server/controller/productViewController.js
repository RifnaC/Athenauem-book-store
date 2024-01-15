const product = require('../models/products');

exports.singleView= async (req, res, next) => {
    const id = req.params.id
    const item = await product.findById(id);
    console.log(item)
    const off =  Math.floor((item.discount * 100) / item.originalPrice)
    console.log(off)
    res.render('singleProductView', {item: item})
}