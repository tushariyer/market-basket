// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var mongoose = require('mongoose'); // MongoDB connect
var Schema =  mongoose.Schema; // Mongoose Schema object

// product schema includes what we display about the products
var schema = new Schema({
    imageDir: {
        type: String,
        required: true
    }, // All required
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Product', schema);