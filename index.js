const { config } = require('dotenv');
const express = require('express')
const hbs = require ('hbs');
const path = require('path')
const dotenv = require('dotenv').config({path:'config.env'})
const morgan = require('morgan')
const bodyParser = require('body-parser');
const session = require('express-session');

const connectDB = require('./server/database/connection');

const app = express();

const port = process.env.PORT || 5000

//log request
app.use(morgan('tiny'));

// mongodb connection
connectDB();

app.use(bodyParser.urlencoded({extended: true}))
// set view engines
app.set('view engine','hbs')
// app.set ('views', path.resolve(__dirname,'views/hbs'))

// load assets
app.use('/css', express.static(path.resolve(__dirname,"assets/css")))
app.use('/img', express.static(path.resolve(__dirname,"assets/img")))
app.use('/js', express.static(path.resolve(__dirname,"assets/js")))
app.use('/scss', express.static(path.resolve(__dirname,"assets/scss")))

// load routers
app.use('/',require('./server/routes/router'))


// load sessions
// app.use(session({
//     secret: "my secret key",
//     // saveUnintialized: true,
//     resave: false,
// })
// );

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


app.listen(port , ()=> {
    console.log('> Server is up and running on port : ' + port)}
    )