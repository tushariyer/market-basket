// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var express = require('express'); // Use express
var router = express.Router(); // Router init

var Basket = require('../models/basket'); // Use basket model for basket
var Product = require('../models/product'); // Use product model for products
var Order = require('../models/order'); // Use order model to store information about purchases

// HTTP GET to render home page
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0]; // Get any success messages
    Product.find(function (err, docs) {
        var pChunks = []; // array of rows to display
        for (var i = 0; i < docs.length; i += 3) {
            pChunks.push(docs.slice(i, i + 3)); // Push three products into a row
        }
        res.render('store/index', {
            title: 'Mongo Market Basket',
            products: pChunks,
            successMsg: successMsg,
            noMessage: !successMsg // True only if no success messages exist
        }); // Render the page with products chunked by 3
    });
});

// HTTP GET to add content to the basket
router.get('/add/:id', function (req, res, next) {
    var foodId = req.params.id; // Get the passed product id
    var basket = new Basket(req.session.basket ? req.session.basket : {}); // Init basket with old basket if old exists

    Product.findById(foodId, function (err, product) {
        if (err) {
            return res.redirect('/'); // If error then redirect to index
        }

        basket.add(product, product.id); // Add the product and its ID
        req.session.basket = basket; // Store basket in session storage
        console.log(req.session.basket); // Print basket to console so we know things are being added
        res.redirect('/'); // Redirect to index
    });
});

// HTTP GET to remove one unit of a particular item from the basket
router.get('/removeone/:id', function (req, res, next) {
    var foodId = req.params.id; // Get the passed product id
    var basket = new Basket(req.session.basket ? req.session.basket : {}); // Init basket with old basket if old exists

    basket.removeOne(foodId); // Remove the item
    req.session.basket = basket; // Update basket in session

    // If this operation makes the total quantity <= 0
    if (req.session.basket.qtyProducts <= 0){
        req.session.basket = null; // Empty out the session basket
    }
    res.redirect('/basket'); // Go back to basket for further operations
});

// HTTP GET to remove all units of a particular item from the basket
router.get('/removeall/:id', function (req, res, next) {
    var foodId = req.params.id; // Get the passed product id
    var basket = new Basket(req.session.basket ? req.session.basket : {}); // Init basket with old basket if old exists

    basket.removeAll(foodId); // Remove the item
    req.session.basket = basket; // Update basket in session

    // If this operation makes the total quantity <= 0
    if (req.session.basket.qtyProducts <= 0){
        req.session.basket = null; // Empty out the session basket
    }
    res.redirect('/basket'); // Go back to basket for further operations
});

// HTTP GET to view basket
router.get('/basket', function (req, res, next) {
    // Check if basket is empty
    if (!req.session.basket) {
        return res.render('store/basket', {
            products: null
        }); // Render basket but with the 'empty basket' notice
    }
    var basket = new Basket(req.session.basket); // Init basket and populate from session
    res.render('store/basket', {
        products: basket.basketToArray(),
        totalPrice: basket.totalPrice
    }); // Render basket page with items now in array
});

// HTTP GET to get to checkout
router.get('/checkout', loggedIn, function (req, res, next) {
    // Check if basket is empty
    if (!req.session.basket) {
        return res.redirect('/basket'); // Redirect to basket page
    }
    var basket = new Basket(req.session.basket); // Init basket and populate from session
    var errMsg = req.flash('error')[0]; // Get first element of error object
    res.render('store/checkout', {
        total: basket.totalPrice,
        errMsg: errMsg,
        noError: !errMsg // True only if errMsg has no values
    });
});

// HTTP POST to create a charge
router.post('/checkout', loggedIn, function (req, res, next) {
    // Check if basket is empty
    if (!req.session.basket) {
        return res.redirect('/basket'); // Redirect to basket page
    }
    var basket = new Basket(req.session.basket); // Init basket and populate from session

    var stripe = require("stripe")(); // Add STRIPE test token here as a string

    stripe.charges.create({
        amount: basket.totalPrice * 100, // Price in lowest denomination of usd
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Card Charge"
    }, function(err, charge) {
        if (err){
            req.flash('error', err.message); // If errors, get the message
            return res.redirect('/checkout'); // Redirect to checkout page
        }

        // Create an object for this specific order
        var order = new Order({
            user: req.user, // User object is stored on the request by passport
            basket: basket, // So we know what items were bought
            name: req.body.name, // Express stores POST data on the body
            address: req.body.address,
            paymentID: charge.id // Store the charge ID
        });

        // Save order to MongoDB
        order.save(function (err, result) {
            if (err){
                req.flash('error', err.message); // If errors, get the message
                return res.redirect('/checkout'); // Redirect to checkout page
            }
            req.flash('success', 'Purchase Successful'); // Success message
            req.session.basket = null; // Empty out the session basket
            res.redirect('/'); // Go back home
        });
    });
});

module.exports = router;

// Function to check if login is successful
function loggedIn(req, res, next) {
    // If Auth successful
    if (req.isAuthenticated()){
        return next();
    }
    req.session.oldURL = req.url; // Store where the user was trying to go so we can redirect after logging in
    res.redirect('/user/login'); // Redirect to index page
}
