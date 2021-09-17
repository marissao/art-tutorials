const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if jwt exists & is verified
    if (token) {
        // Make sure jwt has not been tampered with
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log("requireAuth token error: ", err.message);
                res.redirect("/login");
            } else {
                console.log("requireAuth decoded token: ", decodedToken);
                next(); 
            }
        });
    } else {
        res.redirect("/login");
    }
};

// Used for conditional rendering of nav bar, applied to all routes
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("checkUser token error: ", err.message);
                res.locals.user = null;
                next();
            } else {
                console.log("checkUser decoded token: ", decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user.toObject();
                next(); 
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const checkIsCreator = async (req, res, next) => {
    const courseId = req.params.id;
    console.log("courseId middleware: ", courseId);
    const decodedToken = jwt.verify(req.cookies.jwt, process.env.SECRET);
    const userId = decodedToken.id;
    
    if (courseId) {
        await Course.findById(courseId)
        .then(result => {
            if (result.creatorId === userId) {
                console.log("Logged in user is the course's creator");
                next();
            } else {
                console.log("Logged in user did not create this course");
                res.redirect("/");
            }
        })
        .catch(err => {
            console.log(err);
        })
    } else {
        console.log("courseId does not exist");
        res.redirect("/");
    }
};

// res.locals is an obj passed into the rendering engine
// Thus courses.js controller, function createCoursePost, will log "[Object: null prototype] {}" if you console.log(res.locals)

module.exports = { requireAuth, checkUser, checkIsCreator };