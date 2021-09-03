const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
                if (err) {
                    console.log("Home page token error: ", err.message);
                    res.render('guest-home');
                } else {
                    console.log("Decoded token: ", decodedToken);
                    next(); 
                }
            });
        } else {
            res.render('guest-home');
        }
    },
    (req, res) => {
        res.render('user-home');
    });
};