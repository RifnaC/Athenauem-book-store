const express = require('express')
const route = express.Router();
const services = require('../services/render')
const auth = require('../controller/adminAuthController');


route.get('/login',services.login);
route.get('/signup', services.signup);

route.get('/password', services.forgotPswd);

route.post('/forgot-password', auth.forgotPassword);

route.get('/reset', auth.reset)
route.post('/otp', auth.otp)

route.get('/change-passwod/:id', auth.changePswd);
route.post('/resetPswd/:id', auth.resetPswd);


route.get('/logout', auth.logout);

route.post('/api/auth/signup', auth.register);
route.post('/login', auth.login);




module.exports = route