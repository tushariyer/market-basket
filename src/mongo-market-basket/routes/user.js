// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var express = require('express'); // Use express
var router = express.Router(); // Router init
var csrf = require('csurf'); // CSRF protection
var passport = require('passport'); // Use passposts

var csrfProtect = csrf(); // CSRF init
router.use(csrfProtect);

var Order = require('../models/order'); // Use the order model to show what users have purchased
var Basket = require('../models/basket'); // Use basket model for basket

// HTTP GET to render user account (called if registration is successful)
router.get('/account', loggedIn, function (req, res, next) {
    Order.find({ // Query MongoDB for orders based on the user that Passport has authenticated
        user: req.user
    }, function (err, orders) {
        if (err){
            return res.write('Error! No Orders Found');
        }

        var basket; // Variable for the basket that was bought
        orders.forEach(function (order) {
            basket = new Basket(order.basket); // Init new basket with old basket items
            order.items = basket.basketToArray(); // Store items
        });
        res.render('../views/user/account', {
            orders: orders
        });
    });
    // res.render('../views/user/account');
});

// HTTP GET to render user logged out state
router.get('/logout', loggedIn, function (req, res, next) {
    req.logout(); //  Log out of account
    res.redirect('/'); // Redirect to index
});

// USE protocol to handle unAuthed movement
router.use('/', notloggedIn, function (req, res, next) {
    next(); // Check the not logged in for all unAuthed routing
});

// HTTP GET to render registration page
router.get('/register', function (req, res, next) {
    var msgs = req.flash('error');
    res.render('user/register', {
        csrfToken: req.csrfToken(),
        messages: msgs,
        errs: msgs.length > 0
    }); // Use tokens for CSRF protection
});

// HTTP POST to send the user info from registration page
router.post('/register', passport.authenticate('local.register', {
    failureRedirect: '/user/register', // If :(
    failureFlash: true // Let 'em know
}), function (req, res, next) {
    if (req.session.oldURL){ // If we were forced to register first
        var oldURL = req.session.oldURL; // Temp store
        req.session.oldURL = null; // Clear the field
        res.redirect(oldURL); // Go to originally intended page
    } else {
        res.redirect('/user/account');
    }
});

// HTTP GET to render user account (called if login is successful)
router.get('/login', function (req, res, next) {
    var msgs = req.flash('error');
    res.render('../views/user/login', {
        csrfToken: req.csrfToken(),
        messages: msgs,
        errs: msgs.length > 0
    }); // Use tokens for CSRF protection
});

// HTTP POST for user login
router.post('/login', passport.authenticate('local.login', {
    failureRedirect: '/user/login', // If :(
    failureFlash: true // Let 'em know
}), function (req, res, next) {
    if (req.session.oldURL){ // If we were forced to login first
        var oldURL = req.session.oldURL; // Temp store
        req.session.oldURL = null; // Clear the field
        res.redirect(oldURL); // Go to originally intended page
    } else {
        res.redirect('/user/account');
    }
});

module.exports = router;

// Function to check if login is successful
function loggedIn(req, res, next) {
    // If Auth successful
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/'); // Redirect to index page
}

// Function to check if login has not happened successfully (or at all)
function notloggedIn(req, res, next) {
    // If Auth not occured or not successful
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/'); // Redirect to index page
}

