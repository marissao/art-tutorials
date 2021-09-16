const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

const handleErrors = (err) => {
    console.log("Printing err.message & err.code", err.message, err.code);
    let errors = { title: '', description: '', imageUrl: '', isPublic: ''};

    // Validation Errors
    if (err.message.includes('Course validation failed')) {
        Object.values(err.errors).forEach(({properties})=> {
            errors[properties.path] = properties.message; 
        });
    }

    // Duplicate error code
    if (err.code === 11000) {
        errors.title = "That course name has already been taken. Please try again.";
    }

    return errors;
};

exports.createCourse = (req, res) => res.render('create-course');

exports.createCoursePost = async (req, res) => {
    const decodedToken = jwt.verify(req.cookies.jwt, process.env.SECRET);
    const userId = decodedToken.id;
    const { title, description, imageUrl, isPublic } = req.body;
    
    try {
        const course = await Course.create({ title, description, imageUrl, isPublic, creatorId: userId });
        res.status(201).json({ course: course._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

exports.editCourse = async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).lean().exec();
    res.render('edit-course', { course });
}

exports.editCoursePost = async (req, res) => {
    const refererArray = req.headers.referer.split('/');
    const courseId = refererArray[refererArray.length - 1];
    const { title, description, imageUrl, isPublic } = req.body;

    try {
        let doc = await Course.findByIdAndUpdate(courseId, { title, description, imageUrl, isPublic });
        res.status(200).json({ message: "Course has been updated" }); // Object { message: "Course has been updated" } set. Checked on client side to initiate redirect.
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

exports.courseDetails = async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).lean().exec();

    const decodedToken = jwt.verify(req.cookies.jwt, process.env.SECRET); // Returns obj with properties id, iat, and exp
    const userId = decodedToken.id;

    const loggedInUser = await User.findById(userId);

    const enrolled = loggedInUser.enrolledCourses.includes(courseId);

    let loggedInUserIsCreator;
    if (course.creatorId === userId) {
        loggedInUserIsCreator = true;
    } else {
        loggedInUserIsCreator = false;
    }

    res.render('course-details', { course: course, enrolled: enrolled, creator: loggedInUserIsCreator })
};



