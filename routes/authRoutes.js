const auth = require('../controllers/auth');
const { requireAuth } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.get('/register', auth.register);
    app.post('/register/process', auth.registerProcess);

    app.get('/login', auth.login);
    app.post('/login/process', auth.loginProcess);

    app.get('/logout', auth.logout);
};