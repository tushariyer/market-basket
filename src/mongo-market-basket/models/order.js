// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var mongoose = require('mongoose'); // MongoDB connect
var Schema =  mongoose.Schema; // Mongoose Schema object

// order schema includes what we display about the products
var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // Store an ID here
        ref: 'User' // Ensure it links to the proper User model
    },
    basket: {
        type: Object, // Store the basket
        required: true
    },
    name: {
        type: String, // Store the name
        required: true
    },
    address: {
        type: String, // Where to send our goods
        required: true
    },
    paymentID: {
        type: String, // Store the STRIPE payment ID
        required: true
    }
});

module.exports = mongoose.model('Order', schema);
