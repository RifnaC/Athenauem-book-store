const axios = require('axios');


// ***********************Admin Management********************************
exports.homeRoutes = (req, res)=>{
    res.render('index');
}

exports.admin= (req, res)=>{
    axios.get('http://localhost:3000/api/admins')
    .then(function (response) {
        // console.log(response)
        res.render('admin',{admins: response.data});
    })
    .catch(err =>{
        res.send(err);
    } )

}
exports.add_admin= (req, res)=> res.render('addAdmin');


exports.edit_admin= (req, res)=>{
    axios.get('http://localhost:3000/api/admins',{params: {id:req.query.id}})
    .then(function(AdminData){
        res.render('editAdmin',{admin:AdminData.data});
    })
    .catch(err => {
        res.send(err);
    })
}

exports.change_pswd= (req, res)=>{
    res.render('changePswd')
}


// ***********************Shop Management********************************

exports.shop=(req, res)=>{
     axios.get('http://localhost:3000/api/shops')
    // console.log(response.data);
    .then(function (response) {
        res.render('shop', {shops: response.data});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addShop';</script>");
    });
}

exports.add_Shop=(req, res)=>{
    res.render('addShop');
}

exports.edit_Shop=(req, res)=>{
    axios.get('http://localhost:3000/api/shops',{params: {id:req.query.id}})
    .then(function(shopData){
        res.render('editShop',{shop:shopData.data});
    })
    .catch(err => {
        res.send(err);
    })
    // res.render('editShop');
}


// ***********************Product Management********************************
exports.product=(req, res)=>{
    axios.get('http://localhost:3000/api/products')
    // console.log(response.data);
    .then(function (response) {
        res.render('products', {books: response.data});
    })
    .catch(error=>{
        // console.error("An error occurred:", error);
        res.status(500).send("<script>alert('Something Went Wrong'); window.location.href ='/addProduct';</script>");
    });
    // res.render('products', {shop: product});
}

exports.add_product=(req, res)=>{
    res.render('addProduct');
}

exports.edit_product=(req, res)=>{
    res.render('editProduct');
}

// ***********************Category Management********************************
exports.category=(req, res)=>{
    res.render('category');
}

exports.add_category=(req, res)=>{
    res.render('addCategory');
}