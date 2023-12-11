const users = require('../models/userModel');

exports.profile = async(req, res)=>{
    const id = req.user.id;
    console.log('id',id);
    const user = await users.findById(id);
    res.render('profile', {user});
}

exports.updateProfile = async(req, res)=>{
    const id = req.params.id;
    console.log('id',id);
    const user = await users.findByIdAndUpdate(id, req.body, {new: true});
    user.save().then(()=>{
        res.redirect('/profile');
    }).catch(err=>{
        console.log(err);
    });
}

