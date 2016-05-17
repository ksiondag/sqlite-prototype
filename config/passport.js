'use strict';

var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.prototype.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        process.nextTick(function () {

        User.prototype.findOne({'email': email}, function (err, user) {
            var newUser;

            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false,
                    req.flash(
                        'signupMessage',
                        'That email is already taken.'
                    )
                );
            } else {
                newUser = new User();

                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }

        });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.prototype.findOne({'email': email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false,
                    req.flash(
                        'loginMessage',
                        'No user found.'
                    )
                );
            }

            if (!User.prototype.validPassword.call(user, password)) {
                return done(null, false,
                    req.flash(
                        'loginMessage',
                        'Oops! Wrong password.'
                    )
                );
            }

            return done(null, user);
        });
    }));
};

