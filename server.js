const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const main = require('./controllers/main');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

require('./db');

const app = express();

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main', // Specifies default layout
    helpers: {
      section: function(name, options) { // name is "scripts" and options is a function
        // Look inside "this" obj. If property "_sections" does not exist, create this property and set it to an empty obj
        if (!this._sections) this._sections = {};
        
        // Set _sections to be an obj w/ key called "scripts" and the value of the scripts string listed in hbs
        this._sections[name] = options.fn(this);
        
        return null;
      },
    },
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/static'));
app.use(express.json()); // Remove later after testing in Postman

// Routes
app.get("*", checkUser);
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