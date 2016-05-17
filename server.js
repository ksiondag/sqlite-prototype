'use strict';

// setting variables
var express = require('express');
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
require('./app/routes.js')(app, passport);

// launch
app.listen(port);
console.log('Running prototype on port ' + port);

