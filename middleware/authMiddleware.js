const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if jwt exists & is verified
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log("requireAuth token error: ", err.message);
                res.redirect("/login");
            } else {
                console.log("Decoded token: ", decodedToken);
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
                console.log("Decoded token: ", decodedToken);
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

module.exports = { requireAuth, checkUser };