const express = require('express')
const route = express.Router();
const services = require('../services/render')
const auth = require('../controller/authController');
const userController = require('../controller/userController');
const authMid = require('../middlewares/authMiddleware')
const seeder = require('../seeder/adminSeeder');



route.get('/login',services.login);
route.get('/signup',services.signup);

route.get('/logout', auth.logout);

route.post('/api/auth/signup', auth.register);
route.post('/api/auth/signin', auth.login);

route.get('/home', services.home);

// route.get('/home',authMid.authMiddleware, services.userHome)
route.get('/dashboard', authMid.authMiddleware, services.homeRoutes);


module.exports = route