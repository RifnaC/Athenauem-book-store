const express = require('express')
const route = express.Router();
const services = require('../services/render')
const userController = require('../controller/userController');



route.get('/login',services.login);
route.get('/signup',services.signup);

route.post('/api/auth/signup', userController.register);
route.post('/api/auth/signin', userController.login);

route.get('/home', userController.home, services.home);
// GET	/api/test/all	retrieve public content
// GET	/api/test/user	access User’s content
// route.get('/home', services.home);
// GET	/api/test/mod	access Moderator’s content
// GET	/api/test/admin	access Admin’s content

// route.get('/dashboard', services.dashboard);

module.exports = route