const users = require('../models/userModel');

exports.profile = async(req, res)=>{
    const id = req.user.id;
    const user = await users.findById(id);
    res.render('profile', {user});
}

exports.updateProfile = async(req, res)=>{
    const id = req.params.id;
    const user = await users.findByIdAndUpdate(id, req.body, {new: true});
    user.save().then(()=>{
        res.render('profile');
    }).catch(err=>{
        console.log(err);
    });
}


exports.address = (req, res)=>{
    res.render('address');

}
