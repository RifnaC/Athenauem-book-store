const users = require('../models/userModel');

exports.profile = async(req, res)=>{
    const id = req.user.id;
    const user = await users.findById(id);
    const userAddress = user.addresses;
    res.render('profile', {user, userAddress});
}

exports.updateProfile = async(req, res)=>{
    const id = req.params.id;
    const user = await users.findByIdAndUpdate(id, req.body, {new: true});
    await user.save().then(()=>{
        res.render('profile');
    }).catch(err=>{
        console.log(err);
    });
}


exports.address = async(req, res)=>{
    const id = req.user.id;
    const user = await users.findById(id);
    res.render('address', {user});
}

exports.addAddress = async (req, res)=>{
    const id = req.user.id;
    const user = await users.findByIdAndUpdate({_id:id}, {$push:{
        "addresses": {
            fullName:req.body.fullName,
            phone:req.body.phone,
            address:req.body.address,
            city:req.body.city,
            district:req.body.district,
            state:req.body.state,
            pincode:req.body.pincode,
        }
    }});
    user.save().then(()=>{
        res.render('profile');
    }).catch(err=>{
        console.log(err);
    })
}

exports.editAddress = async(req, res)=>{
    const id = req.user.id;
    const addressId = req.query.id;
    const user = await users.findById(id);
    const userAddress = user.addresses.find(address=> address._id == addressId);   
    res.render('addresses',{user, userAddress});
}
exports.updateAddress = async(req, res)=>{
    const id = req.user.id;
    const addressId = req.params.id;
    const newAddress = await users.findOneAndUpdate({_id:id, "addresses._id":addressId}, {$set:{
        "addresses.$.fullName":req.body.fullName,
        "addresses.$.phone":req.body.phone,
        "addresses.$.address":req.body.address,
        "addresses.$.city":req.body.city,
        "addresses.$.district":req.body.district,
        "addresses.$.state":req.body.state,
        "addresses.$.pincode":req.body.pincode
    }})
    await newAddress.save().then(()=>{
        res.render('profile');
    })
}

exports.deleteAddress = async(req, res)=>{
    const id = req.user.id;
    const addressId = req.params.id;
    const newAddress = await users.findOneAndUpdate({_id:id}, {$pull:{
        "addresses": {
            _id:addressId
        }
    }});
    await newAddress.save().then(()=>{
        res.render('profile');
    })
}
