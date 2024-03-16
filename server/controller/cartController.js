const { log } = require('handlebars');
const Cart = require('../models/cartModel');
const Books = require('../models/products');
const { category } = require('../services/render');
const path = require('path');
const mongoose = require('mongoose');

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

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const quantity = req.body.quantity;
    const price = await Books.find({ _id: new mongoose.Types.ObjectId(productId) }, { price: 1, _id: 0 });
    const subTotal = price[0].price;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const cart = new Cart({
                userId,
                items: [{ productId, quantity, subTotal }],
                totalPrice: 0,
            });
            await cart.save()
        } else {
            const productExist = cart.items.findIndex(items => items.productId == productId);
            if (productExist !== -1) {
                await Cart.findOneAndUpdate(
                    { 'userId': userId, 'items.productId': productId },
                    { $inc: { 'items.$.quantity': 1, 'items.$.subTotal': subTotal } }
                )
            } else {
                const updateCart = await Cart.findOneAndUpdate({ userId }, {
                    $push: { items: { productId: productId, quantity: quantity, subTotal: subTotal } },
                })
                await updateCart.save()

            }
            res.redirect('back');
        }
    } catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}


exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        const cartId = cart._id;
        const productId = req.body.productId;
        const count = Number(req.body.quantity);
        const book = await Books.find({ _id: productId });
        const price = book[0].price;
        const subTotal = price * count;
        await Cart.findOneAndUpdate(
            {
                _id: cartId,
                'items.productId': productId,
            },
            { $set: { 'items.$.quantity': count, 'items.$.subTotal': subTotal }, }
        );
        await Cart.updateMany(
            { _id: new mongoose.Types.ObjectId(cartId) },
            { $pull: { items: { quantity: { $lt: 1 } } } },
        );
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).send(notification('Something went wrong, please try again later'));
    }
}

exports.cartView = async (req, res) => {
    try {
        const userId = req.user.id;
        const search = req.query.searchQuery || '';
        if (search !== "") {
            res.redirect('/shop-page');
        }
        const cartItems = await Cart.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $unwind: '$items'
            },
            {
                $project: {
                    productId: '$items.productId',
                    quantity: '$items.quantity',
                    subTotal: '$items.subTotal',
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'cartItem',
                }
            },
            {
                $project: {
                    productId: 1,
                    quantity: 1,
                    subTotal: 1,
                    cartItem: { $arrayElemAt: ['$cartItem', 0] },
                }
            },
        ]);

        cartItems.forEach(cartItem => {
            cartItem.totalPrice = cartItem.subTotal
        })
        cartItems.totalPrice = cartItems.reduce((total, item) => total + item.subTotal, 0);
        let emptyCart = false;
        if (cartItems.length === 0) {
            emptyCart = true;

        }
        res.render('cart', { cartItems, emptyCart });
    } catch (error) {
        res.status(404).send(notification('Something went wrong, please try again later'));
    }
}

exports.changeQuantity = async (req, res) => {
    try {
        let { cartId, productId, count, subTotal } = req.body;
        count = Number(count);
        subTotal = Number(subTotal)
        if (count === -1) {
            await Cart.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(cartId),
                    'items.productId': productId,
                },
                {
                    $inc: { 'items.$.quantity': count, 'items.$.subTotal': subTotal }
                }
            );
        } else {
            await Cart.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(cartId),
                    'items.productId': productId,
                    // 'items.quantity': { $gte: count },
                },
                {
                    $inc: { 'items.$.quantity': count, 'items.$.subTotal': subTotal }
                }
            );
        }
        await Cart.updateMany(
            {
                _id: new mongoose.Types.ObjectId(cartId),
                'items.productId': productId
            },
            { $pull: { items: { quantity: { $lt: 1 } } } },
        );
        res.redirect('/cart')
    } catch (error) {
        res.status(404).send(notification('Something went wrong, please try again later'));
    }
};

exports.deleteCartItem = async (req, res) => {
    const { cartId, productId } = req.body;
    try {
        await Cart.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(cartId) },
            { $pull: { 'items': { productId: productId } } }
        ).then(() => {
            res.json({ success: true });
        })
    } catch (error) {
        res.status(500).send(notification('Something went wrong,  please try again later'));
    }
}


