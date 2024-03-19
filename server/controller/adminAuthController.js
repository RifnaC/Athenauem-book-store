const adminCollection = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');

// ***********************user Management********************************

function notification(msg, links) {
    return `<!DOCTYPE html>
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
            imageUrl: "/img/favicon.png",
            title: "Atheneuam",
            imageWidth: 120,
            imageHeight: 80,
            imageAlt: "Atheneuam Logo",
            text: "${msg}",
            confirmButtonColor: '#15877C',
        }).then((result) => {
            window.location.href = "${links}";
        })
    </script>
    </body>
    <!-- JavaScript Libraries -->
    
    </html>`
}

// Register and save new user
const signToken = (id, user) => {
    if (!user) return jwt.sign(id, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    else return jwt.sign({ id, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).send(notification("Content can not be empty", "/signup"));
        return;
    }
    try {
        // Check if the email already exists in the database
        const existingEmail = await adminCollection.findOne({ email: req.body.email });
        if (existingEmail) {
            // Display an alert when email is already taken.
            res.status(200).send(notification("Email already exists", "/signup"));
            return;
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = new adminCollection({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: 'vendor',
            status: "Pending",
        });
        const token = signToken({ id: user._id, role: user.role });
        // save user in database
        const savedUser = await user.save();
        if (token && savedUser.status === 'Active') {
            res.redirect('/');
        }else{
            res.status(300).send(notification("Thank you for choosing Atheneuam. Please wait for admin approval","/signup"));
        }
    } catch (err) {
        res.status(500).send(notification("Some error occured while creating a create operation", "/signup"));
    }
};

//login section
exports.login = async (req, res) => {
    try {
        const admin = await adminCollection.findOne({ email: req.body.email });
        if (!admin) {
            res.status(404).send(notification("This email is not found.", "/login"));
            return;
        }
        const ispswdValid = await bcrypt.compare(req.body.password,  admin.password);
        if (!ispswdValid) {
            res.status(401).send(notification("Invalid password.", "/login"));
            return;
        }
        const data = {
            id:admin.id,
            email: admin.email,
            role: admin.role,
            name: admin.name,
            status: admin.status,
        };
        const token = signToken(admin._id, data);
        res.cookie('token', token, { httpOnly: false, secure: true, });
        
        if (data.status !== 'Active') {
            return res.status(401).send(notification('Thank you for choosing Atheneuam. Please wait for admin approval', '/login'))
        } else {
            res.redirect('/');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(notification('Internal Server Error', '/login'));
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
        if (!existingEmail) {
            res.status(404).send(notification('Email does not exist', '/password'));
            return;
        }
        await updatedEmail(email, otp);

        await sendEmail(email, otp);
        res.render('reset', { email: email });

    } catch (err) {
        console.log(err);
        res.status(500).send(notification('Internal Server Error', '/password'));
    }
}
//  otp generation
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function findExistingEmail(email) {
    const existingAdmin = await adminCollection.findOne({ email: email });
    return existingAdmin;
}
async function updatedEmail(email, otp) {
    const updateOtp = await adminCollection.findOneAndUpdate({ email: email },
        { $set: { otp: otp, otpExpiry: Date.now() + 300000 } },
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
            // notification('Cannot send email, please try again later', history.back());
            console.log(err);
        } else {
            // notification('Sent email successfully',)
            console.log("Email sent: " + info.response);
        }
    })
}

exports.reset = async (req, res) => {
    res.render('reset')
}

exports.otp = async (req, res) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        const user = await adminCollection.findOne({ email: email, otp: otp, otpExpiry: { $gt: Date.now() } });
        const id = user._id;
        if (!user) {
            res.status(404).send(notification("please check the OTP", "/password"));
        }
        else {
            res.redirect('/change-passwod/' + id);
        }
    }catch (error) {
        res.status(500).send(notification('The OTP has expired', '/password'));
    }
}

exports.changePswd = async (req, res) => {
    res.render('changePswd', { id: req.params.id })
}

exports.resetPswd = async (req, res) => {
    try {
        const password = req.body.password;
        const user = await adminCollection.findOne({ _id: req.params.id, otpExpiry: { $gt: Date.now() } });
        if (!user) {
            res.redirect('/password');
        }
        user.password = await bcrypt.hash(password, saltRounds);
        await user.save()
        res.redirect('/login'); // Redirect to homepage or any other route

    } catch (error) {
        res.status(500).send(notification('Error resetting password', '/password'));
    }
}





