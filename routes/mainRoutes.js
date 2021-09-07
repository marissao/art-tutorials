const jwt = require('jsonwebtoken');
const Course = require('../models/Course');

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
                if (err) {
                    console.log("Home page token error: ", err.message);
                    res.render('guest-home');
                } else {
                    console.log("Home page decoded token: ", decodedToken);
                    next(); 
                }
            });
        } else {
            res.render('guest-home');
        }
    },
    async (req, res) => {
        try {
            let unsortedCourses = await Course.find({}).lean().exec();
            console.log("unsorted", unsortedCourses);
            let sortedCourses = unsortedCourses.sort((a,b) => {
                return b.createdAt - a.createdAt;
            })
            sortedCourses.forEach(course => {
                course.createdAt = course.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "medium"});
            })
            console.log("sorted", sortedCourses);
            res.render('user-home', { courses: sortedCourses });
            
        }
        catch (err) {
            console.log(err);
        }
        
    });
};