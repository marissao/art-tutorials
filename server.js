const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const handlers = require('./lib/handlers');

require('./db');

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
app.use(handlers.notFound);

// Custom 500
app.use(handlers.serverError);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});