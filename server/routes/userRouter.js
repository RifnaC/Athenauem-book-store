const express = require('express')
const route = express.Router();
const services = require('../services/render')
const userController = require('../controller/userController');



route.get('/login',services.login);
route.get('/signup',services.signup);

route.post('/api/auth/signup', userController.register);
route.post('/api/auth/signin', userController.login);

route.get('/home', userController.home, services.home);
route.get('/dashboard',userController.dashboard, services.homeRoutes);


module.exports = route