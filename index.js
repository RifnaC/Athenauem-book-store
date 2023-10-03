const { config } = require('dotenv');
const express = require('express')
const hbs = require ('hbs');
const path = require('path')
const dotenv = require('dotenv').config({path:' config.env'})
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express();

const port = process.env.PORT || 5000
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({extended: true}))
// set view engines
app.set('view engine','hbs')
// app.set ('views', path.resolve(__dirname,'views/hbs'))

// load assets
app.use('/css', express.static(path.resolve(__dirname,"assets/css")))
app.use('/img', express.static(path.resolve(__dirname,"assets/img")))
app.use('/js', express.static(path.resolve(__dirname,"assets/js")))
app.use('/scss', express.static(path.resolve(__dirname,"assets/scss")))

app.get("/dashboard" , (req , res)=>{
   res.render('index');

})


app.listen(port , ()=> {
    console.log('> Server is up and running on port : ' + port)}
    )