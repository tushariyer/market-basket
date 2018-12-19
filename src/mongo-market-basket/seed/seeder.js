// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var Product = require('../models/product'); // Use product model
var mongoose = require('mongoose'); // MongoDB connections

mongoose.connect('mongodb://localhost:27017/marketbasket',{
    useNewUrlParser: true
}); // Connect to local db server

// Array of products
var products = [
    new Product({
        imageDir: '/images/banana.jpg',
        title: 'Banana',
        price: 1
    }),
    new Product({
        imageDir: '/images/apple.jpg',
        title: 'Apple',
        price: 2
    }),
    new Product({
        imageDir: '/images/orange.jpg',
        title: 'Orange',
        price: 2
    }),
    new Product({
        imageDir: '/images/watermelon.jpg',
        title: 'Watermelon',
        price: 5
    }),
    new Product({
        imageDir: '/images/strawberry.jpg',
        title: 'Strawberries',
        price: 3
    }),
    new Product({
        imageDir: '/images/mango.jpg',
        title: 'Mangoes',
        price: 4
    })
];

var counter = 0; // counter for product-page row usage

// Save them in sets of three, for easy handlbar rendering
for (var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        counter++;
        if (counter === products.length){
            die();
        }
    });
}

// :(
function die() {
    mongoose.disconnect(); // No more MongoDB
}