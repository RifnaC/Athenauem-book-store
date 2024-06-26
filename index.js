const { config } = require('dotenv');
const express = require('express')
const exphbs = require ('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path')
const dotenv = require('dotenv').config({path:'config.env'})
const morgan = require('morgan')
const bodyParser = require('body-parser');
const session = require('express-session');
const {superAdmin} = require('./server/seeder/adminSeeder');
const connectDB = require('./server/database/connection');
const cookieParser= require('cookie-parser');


const userApp = express();
const adminApp = express();
// port for admin and user
const adminPort = process.env.ADMIN_PORT ;
const userPort = process.env.USER_PORT;

adminApp.use(cookieParser());
adminApp.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));

userApp.use(cookieParser());
userApp.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));

//log request
adminApp.use(morgan('tiny'));
userApp.use(morgan('tiny'));

// mongodb connection
connectDB();
userApp.use(bodyParser.json());
adminApp.use(bodyParser.urlencoded({extended: true}))
userApp.use(bodyParser.urlencoded({extended: true}))

// set view engines
adminApp.use (express.static(path.join(__dirname,'views')));
adminApp.set('view engine','hbs')

userApp.use (express.static(path.join(__dirname,'views')));
userApp.set('view engine','hbs')
  

// load assets
adminApp.use('/css', express.static(path.resolve(__dirname,"assets/css")))
adminApp.use('/img', express.static(path.resolve(__dirname,"assets/img")))
adminApp.use('/js', express.static(path.resolve(__dirname,"assets/js")))
adminApp.use('/scss', express.static(path.resolve(__dirname,"assets/scss")))
adminApp.use('/lib', express.static(path.resolve(__dirname,"assets/lib")))

// load assets
userApp.use('/css', express.static(path.resolve(__dirname,"assets/css")))
userApp.use('/img', express.static(path.resolve(__dirname,"assets/img")))
userApp.use('/js', express.static(path.resolve(__dirname,"assets/js")))
userApp.use('/scss', express.static(path.resolve(__dirname,"assets/scss")))
userApp.use('/lib', express.static(path.resolve(__dirname,"assets/lib")))

// load routers
adminApp.use('/',require('./server/routes/adminRouter'));
adminApp.use('/',require('./server/routes/router'))
adminApp.use('/',require('./server/routes/couponRouter')); 

userApp.use('/',require('./server/routes/authRouter'));
userApp.use('/',require('./server/routes/userRouter'));

adminApp.listen(adminPort , ()=> {
    console.log('> Admin Side Server is up and running on port : ' + adminPort)
});

userApp.listen(userPort , ()=> {
    console.log('> User Side Server is up and running on port : ' + userPort)

})