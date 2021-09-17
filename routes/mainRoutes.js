const jwt = require('jsonwebtoken');
const Course = require('../models/Course');

module.exports = (app) => {
    app.get('/', async (req, res, next) => {
        const token = req.cookies.jwt;
        let unsortedCourses = await Course.find({}).lean().exec();
        let top3CoursesSorted = unsortedCourses.sort((a,b) => {
            return b.enrolledUsers.length - a.enrolledUsers.length;
        }).slice(0, 3)

        // Check if token exists
        if (token) {
            jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
                if (err) {
                    console.log("Home page token error: ", err.message);
                    res.render('guest-home', { courses: top3CoursesSorted });
                } else {
                    // If token has been verified and there is no err, pass on request to next middleware in the pipeline
                    console.log("Home page decoded token: ", decodedToken);
                    next(); 
                }
            });

        // Token does not exist
        } else {
            res.render('guest-home', { courses: top3CoursesSorted });
        }
    },
    async (req, res) => {
        try {
            let unsortedCourses = await Course.find({}).lean().exec();
            console.log("All courses, unsorted:", unsortedCourses);
            let sortedCourses = unsortedCourses.filter(course => course.isPublic === true).sort((a,b) => {
                return b.createdAt - a.createdAt;
            })
            sortedCourses.forEach(course => {
                course.createdAt = course.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "medium"});
            })
            console.log("Public courses sorted w/ date & time formatted:", sortedCourses);
            res.render('user-home', { courses: sortedCourses });
            
        }
        catch (err) {
            console.log(err);
        }
        
    });
};