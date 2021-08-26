const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();
const port = process.env.PORT || 5000;

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main', // Specifies default layout
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/static'));
console.log(__dirname);

app.get('/', (req, res) => res.render('guest-home'));

app.get('/login', (req, res) => res.render('login'));

app.get('/register', (req, res) => res.render('register'));

app.get('/create-course', (req, res) => res.render('create-course'));

app.get('/edit-course', (req, res) => res.render('edit-course'));

app.get('/course-details', (req, res) => res.render('course-details'));

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