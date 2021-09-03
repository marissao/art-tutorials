const User = require('../models/User');
const brycpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log("Printing err.message & err.code", err.message, err.code); // Code property does not exist on most errors but exists on the "unique" error
    let errors = { username: '', password: '', repeatPassword: ''}; // Create error obj which will be sent back to user as JSON

    // Incorrect username
    if (err.message === "Incorrect username") {
        errors.username = "That username is not registered";
    }

    // Incorrect password
    if (err.message === "Incorrect password") {
        errors.password = "That password is incorrect";
    }

    // Duplicate error code
    if (err.code === 11000) {
        errors.username = "That username is taken. Try another.";
    }

    // Validation Errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties})=> {
            errors[properties.path] = properties.message; 
        });
    }

    return errors;
};

// const checkPassword = async (plainTextPassword, hash) => {
//     return await brycpt.compare(plainTextPassword, hash)
//     .then(res => {
//         console.log("Resolved promise: ", res);
//     })
//     .catch(err => {
//         console.log(err);
//     });
//  }; 

const maxAge = 24 * 60 * 60; // 1 day in seconds
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
};

exports.register = (req, res) => res.render('register');

exports.registerProcess = async (req, res) => {
    const { username, password, repeatPassword } = req.body;
    
    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // Multiply by 1000 to convert seconds to ms
        res.status(201).json({user: user._id});
    } 
    catch (err) { // Err obj contains error messages from user schema 
        const errors = handleErrors(err);

        // From handleErrors function, send errors back to user as JSON. Show errors to user on front-end.
        res.status(400).json( { errors });
    }
};

exports.login = (req, res) => res.render('login');

exports.loginProcess = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password); // Grab the email and password sent in the req.body
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

exports.logout = (req, res) => {
    // Replace cookie w/ an empty string and short expiration date
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};