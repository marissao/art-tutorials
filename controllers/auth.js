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