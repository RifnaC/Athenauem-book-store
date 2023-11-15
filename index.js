const { config } = require('dotenv');
const express = require('express')
const hbs = require ('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path')
const dotenv = require('dotenv').config({path:'config.env'})
const morgan = require('morgan')
const bodyParser = require('body-parser');
const session = require('express-session');
const {superAdmin} = require('./server/seeder/adminSeeder');
const connectDB = require('./server/database/connection');

const app = express();


const port = process.env.PORT || 5000

app.use(session({
    secret: 'session-rifna',
    resave: false,
    saveUninitialized: true,
}));

//log request
app.use(morgan('tiny'));

// mongodb connection
connectDB();

app.use(bodyParser.urlencoded({extended: true}))


// set view engines
app.set('view engine','hbs')
  

// app.engine('hbs', hbs.engine({
//     extname: 'hbs',
//     defaultLayout: 'dashboard',
//     layoutDir: __dirname + '/views/layouts/',
//     partialsDir: __dirname + '/views/partials/',
// }));
// app.set ('views', path.resolve(__dirname,'views'))

// load assets
app.use('/css', express.static(path.resolve(__dirname,"assets/css")))
app.use('/img', express.static(path.resolve(__dirname,"assets/img")))
app.use('/js', express.static(path.resolve(__dirname,"assets/js")))
app.use('/scss', express.static(path.resolve(__dirname,"assets/scss")))
app.use('/lib', express.static(path.resolve(__dirname,"assets/lib")))

// load routers
app.use('/',require('./server/routes/router'))
app.use('/',require('./server/routes/authRouter'));
app.use('/',require('./server/routes/userRouter'));

app.listen(port , ()=> {
    console.log('> Server is up and running on port : ' + port)
});
