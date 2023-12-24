const { log } = require('handlebars');
const Admindb = require('../models/model')
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const dotenv = require('dotenv').config({path:'config.env'})

// seeding super-admin
const superAdmin = async() => {
        const password = await bcrypt.hash(process.env.SEEDER_PASSWORD, saltRounds);
        const admin = await Admindb.findOne({email: process.env.SEEDER_EMAIL});
        if(!admin){
            Admindb.create({
                name: process.env.SEEDER_NAME,
                email: process.env.SEEDER_EMAIL,
                password: password,
                role:process.env.SEEDER_ROLE,
                status: process.env.SEEDER_STATUS,
            })
            console.log('Super Admin created successfully')
        }
        console.log('Super Admin already exists');
        return;
    
};
superAdmin().then(() => {
});