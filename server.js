const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const handlers = require('./lib/handlers');

const app = express();

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main', // Specifies default layout
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/static'));

app.get('/', handlers.home);

app.get('/register', handlers.register);
app.post('/register/process', handlers.registerProcess);

app.get('/login', handlers.login);
app.post('/login/process', handlers.loginProcess);

app.get('/create-course', handlers.createCourse);

app.get('/edit-course', handlers.editCourse);

app.get('/course-details', handlers.courseDetails);

// Custom 404 Page
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// Custom 500
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500);
    res.render('500');
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});