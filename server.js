const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const main = require('./controllers/main');

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

require('./routes/mainRoutes')(app);
require('./routes/authRoutes')(app);
require('./routes/courseRoutes')(app);

// Custom 404 Page
app.use(main.notFound);

// Custom 500
app.use(main.serverError);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});