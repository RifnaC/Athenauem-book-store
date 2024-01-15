const product = require('../models/products');
const shops = require('../models/shopModel');

exports.singleView= async (req, res, next) => {
    const id = req.params.id
    const item = await product.findById(id);
    const vendorId = item.shopId;
    const shop = await shops.findById(vendorId);
    console.log(shop);
    const off =  Math.floor((item.discount * 100) / item.originalPrice)
    res.render('singleProductView', {item: item, off:off, shop:shop})
}