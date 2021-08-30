const db = require('../db');

exports.createCourse = (req, res) => res.render('create-course');

exports.editCourse = (req, res) => res.render('edit-course');

exports.courseDetails = (req, res) => res.render('course-details');



