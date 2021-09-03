const auth = require('../controllers/auth');

module.exports = (app) => {
    app.get('/register', auth.register);
    app.post('/register/process', auth.registerProcess);

    app.get('/login', auth.login);
    app.post('/login/process', auth.loginProcess);

    app.get('/logout', auth.logout);
};