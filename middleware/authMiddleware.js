const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

const checkIsCreator = (req, res, next) => {
    const courseId = req.params.id;
    console.log("courseId middleware: ", courseId);
    const token = req.cookies.jwt;
    next()
    // if (token) {
    //     jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    //         if (err) {
    //             console.log("checkIsCreator: ", err.message);
    //             res.redirect("/");
    //         } else {
    //             console.log("checkIsCreator decoded token: ", decodedToken);

    //             next(); 
    //         }
    //     });
    // } else {
    //     res.redirect("/");
    // }
};

// res.locals is an obj passed into the rendering engine
// Thus courses.js controller, function createCoursePost, will log "[Object: null prototype] {}" if you console.log(res.locals)

module.exports = { requireAuth, checkUser, checkIsCreator };