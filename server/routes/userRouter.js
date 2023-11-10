const express = require('express')
const route = express.Router();
const services = require('../services/render')
const auth = require('../controller/authController');
const userController = require('../controller/userController');
const seeder = require('../seeder/adminSeeder');



route.get('/login',services.login);
route.get('/signup',services.signup);

route.post('/api/auth/signup', auth.register);
route.post('/api/auth/signin', auth.login);

route.get('/home', userController.home, services.home);
route.get('/dashboard',userController.dashboard, services.homeRoutes);


module.exports = route