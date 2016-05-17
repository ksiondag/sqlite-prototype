'use strict';

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
};

module.exports = function (app, passport) {
    // Home page
    app.get('/', function (req, res) {
        res.render('index.html');
    });

    app.get('/login', function (req, res) {
        res.render('login.html', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.html', {
            user : req.user
        });
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

