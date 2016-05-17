'use strict';

// setting variables
var express = require('express');
var sqlitePrototype = express();
var app = express();
var port = process.env.PORT || 8080;

var nunjucks = require('nunjucks');

var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

nunjucks.configure('views', {
    autoescape: true,
    express: sqlitePrototype
});

require('./config/passport')(passport);

// setup express application
sqlitePrototype.use(morgan('dev'));
sqlitePrototype.use(cookieParser());
sqlitePrototype.use(bodyParser.urlencoded({extended: true}));
sqlitePrototype.use(bodyParser.json());

// app.set('view engine', 'nunjucks');

// required for passport
sqlitePrototype.use(session({
    secret: 'prototypingiskeykiss',
    resave: true,
    saveUninitialized: true
}));

sqlitePrototype.use(passport.initialize());
sqlitePrototype.use(passport.session());
sqlitePrototype.use(flash());

// routes
console.log(process.argv);
sqlitePrototype.set('root', process.argv[2] || '/sqliteprototype');
require('./app/routes.js')(sqlitePrototype, passport);

// launch
app.enable('strict routing');
app.get('/sqliteprototype', function (req, res) {
    res.redirect('/sqliteprototype/');
});
app.use('/sqliteprototype/', sqlitePrototype);
app.listen(port);
console.log('Running prototype on port ' + port);

