const db = require('../db');

exports.api = {};

exports.home = (req, res) => res.render('guest-home');

exports.register = (req, res) => res.render('register');
exports.registerProcess = (req, res) => {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    console.log('Repeat Password Email: ' + req.body.repeatPassword);
    res.redirect(303, '/');
};

exports.login = (req, res) => res.render('login');
exports.loginProcess = (req, res) => {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    res.redirect(303, '/');
};

exports.createCourse = (req, res) => res.render('create-course');

exports.editCourse = (req, res) => res.render('edit-course');

exports.courseDetails = (req, res) => res.render('course-details');

exports.notFound = (req, res) => res.render('404');

exports.serverError = (err, req, res, next) => res.render('500');
