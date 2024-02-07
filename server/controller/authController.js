const { log } = require('handlebars');
const userCollection = require('../models/userModel');
const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');

// ***********************user Management********************************
// Register and save new user
const signToken = (id, user) => {
    if (!user) return jwt.sign(id, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    else return jwt.sign({ id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty' })
        return;
    }
    try {
        // Check if the email already exists in the database
        const existingUser = await userCollection.findOne({ email: req.body.email });
        const existingEmail = await adminCollection.findOne({ email: req.body.email });
        if (existingUser || existingEmail) {
            // Display an alert when email is already taken.
            res.status(200).send(
                "<script>alert('Email already exists'); window.location.href ='/signup';</script>"
            );
            return;
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = new userCollection({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: 'User',
            status: req.body.status,
        });
        const token = signToken({ id: user._id, role: user.role });
        // save user in database
        const savedUser = await user.save();
        if (token) {
            res.redirect('/homes');
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occured while creating a create operation"
        });
    }
};

//login section
exports.login = async (req, res) => {
    try {
        const user = await userCollection.findOne({ email: req.body.email });
        const admin = await adminCollection.findOne({ email: req.body.email });
        if (!user && !admin) {
            res.status(404).send({ message: "This email is not found." })
            return;
        }
        const ispswdValid = await bcrypt.compare(req.body.password, (user || admin).password);
        if (!ispswdValid) {
            res.status(401).send({ message: "Invalid password." });
            return;
        }
        const data = {
            id: (user || admin).id,
            email: (user || admin).email,
            role: admin ? admin.role : 'User',
            name: (user || admin).name,
            status: (user || admin).status,
        };
        const token = signToken((user || admin)._id, data);
        res.cookie('token', token, { httpOnly: true, secure: true });
        // req.session.token = token;
        if (data.role !== 'User') {
            res.redirect('/dashboard');
        } else {
            if (user.status === 'Block') {
                res.render('login', { Blocked: true });
            } else {
                res.redirect('/homes');
            }
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

// Logout function
exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};


exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = generateOTP();
        const existingEmail = await findExistingEmail(email);
        if (!existingEmail ) {
            res.status(404).send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="utf-8">
                <title>Atheneuam - Book Colleciton</title>
                <meta content="width=device-width, initial-scale=1.0" name="viewport">
                <meta content="" name="keywords">
                <meta content="" name="description">
            
                <!-- Favicon -->
                <link href="img/book collection 0.png" rel="icon">
            
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </head>
            <body>
            <script> 
                Swal.fire({
                    icon: 'error',
                    title: 'Atheneuam',
                    text: 'Email does not exist',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#15877C',
                }).then((result) => {
                    window.location.href = '/password';
                })
            </script>
            </body>
            <!-- JavaScript Libraries -->
            
            </html>`);
            return;
        }
        
        await updatedEmail(existingEmail, email, otp);

        await sendEmail(email, otp);
        res.redirect('/password');

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function findExistingEmail(email) {
    const existingAdmin = await adminCollection.findOne({ email: email });
    const existingUser = await userCollection.findOne({ email: email });
    return existingAdmin || existingUser;
}
async function updatedEmail(existingEmail, email, otp) {
    const updateOtp =  await (existingEmail.role === 'User' ? userCollection : adminCollection).findOneAndUpdate({ email: email },
        { $set:{ otp: otp, otpExpiry: Date.now() + 300000 } }, 
        { new: true });
    return updateOtp;
}


async function sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });
    const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject: "Password Reset",
        html: `
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing Atheneuam. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
            <h2>${otp}</h2>`
    };
    transporter.sendMail(mailOptions, (err, info) => {
       if (err) {
           console.log(err);
       }else{
           console.log("Email sent: " + info.response);
           window.location.href = '/reset';
       }
    })
}
exports.reset = async (req, res) => {
    res.render('reset')
}







