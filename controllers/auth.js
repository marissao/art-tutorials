const User = require('../models/User');
const brycpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log("Printing err.message & err.code", err.message, err.code); // Code property does not exist on most errors but exists on the "unique" error
    let errors = { username: '', password: '', repeatPassword: ''}; // Create error obj which will be sent back to user as JSON

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

const checkPassword = async (plainTextPassword, hash) => {
    return await brycpt.compare(plainTextPassword, hash)
    .then(res => {
        console.log("Resolved promise: ", res);
    })
    .catch(err => {
        console.log(err);
    });
 }; 

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
    // res.redirect(303, '/');
};

exports.login = (req, res) => res.render('login');

exports.loginProcess = (req, res) => {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    res.redirect(303, '/');
};