'use strict';

const nunjucks = require('nunjucks');

const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// setting variables
module.exports = function (express) {
    const app = express();

    nunjucks.configure(__dirname + '/views', {
        autoescape: true,
        express: app
    });

    require('./config/passport')(passport);

    // setup express application
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // app.set('view engine', 'nunjucks');

    // required for passport
    app.use(session({
        secret: 'prototypingiskeykiss',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // routes
    console.log(process.argv);
    require('./app/routes.js')(app, passport);

    return app;
};

