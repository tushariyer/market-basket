// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var User = require('../models/user'); // Use User model
var passport = require('passport'); // Use passports
var strategyLocal = require('passport-local').Strategy; // Strategy to validate users from local-db

// serialize passport inputs
passport.serializeUser(function (user, done) {
    done(null, user.id); // Force usage by id
});

// deserialize passport stuff
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user); // return the errors
    })
});

// Passport strategy for user registration
passport.use('local.register', new strategyLocal({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    // Check inputs before checking database to reduce unnecessary database I/O
    req.checkBody('email', 'Email is Invalid!').notEmpty().isEmail(); // Check if empty or invalid email syntax
    req.checkBody('password', 'Password is Incorrect!').notEmpty().isLength({min: 6}); // Check if empty or password less than 6 chars

    var valErrs = req.validationErrors(); // Store all validation errors

    if (valErrs) {
        var msgs = []; // Array to store error messages to be displayed
        valErrs.forEach(function (err) {
            msgs.push(err.msg); // Load only the message portion of the errors into the array
        });
        return done(null, false, req.flash('error', msgs)); // null because no technical error but not good either
    }

    // Check if email exists
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err); // If problems with registering an email
        }
        if (user) {
            return done(null, false, {
                message: 'Account already exists!'
            }); // If account exists
        }

        var newAccount = new User(); // Create new user
        newAccount.email = email; // store email
        newAccount.password = newAccount.encryptPassword(password); // store encrypted password
        newAccount.save(function (err, res) {
            if (err) {
                return done(err); // Print if save fails
            }
            return done(null, newAccount); // return null, we don't need any notice if it works
        });
    })
}));

// Passport strategy for login
passport.use('local.login', new strategyLocal({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    // Check inputs before checking database to reduce unnecessary database I/O
    req.checkBody('email', 'Email is Invalid!').notEmpty().isEmail(); // Check if empty or invalid email syntax
    req.checkBody('password', 'Password is Incorrect!').notEmpty(); // Check if empty password

    var valErrs = req.validationErrors(); // Store all validation errors

    if (valErrs) {
        var msgs = []; // Array to store error messages to be displayed
        valErrs.forEach(function (err) {
            msgs.push(err.msg); // Load only the message portion of the errors into the array
        });
        return done(null, false, req.flash('error', msgs)); // null because no technical error but not good either
    }

    // Check if email exists
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err); // If problems with registering an email
        }
        if (!user) {
            return done(null, false, {
                message: 'Account not found!'
            }); // If account doesn't exist
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Password Incorrect!'
            }); // If password check fails
        }
        return done(null, user); // If login checks are successful
    })
}));