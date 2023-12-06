const { log } = require('handlebars');
const Admindb = require('../models/model')
const bcrypt = require('bcrypt');
const saltRounds = 10; 

// seeding super-admin
const superAdmin = async() => {
        const password = await bcrypt.hash('admin@22', saltRounds);
        const admin = await Admindb.findOne({email:'admin@admin.com'})
        if(!admin){
            Admindb.create({
                name: 'Rishad',
                email: 'admin@admin.com',
                password: password,
                role: 'admin',
            })
            console.log('Super Admin created successfully')
        }
        console.log('Super Admin already exists');
        return;
    
};
superAdmin().then(() => {
});