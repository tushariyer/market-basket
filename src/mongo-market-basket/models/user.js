// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var mongoose = require('mongoose'); // MongoDB connect
var Schema = mongoose.Schema; // Mongoose Schema object
var bcrypt = require('bcrypt-nodejs'); // Encrypt-y stuff

// Our user schema consists of an email and password
var schema = new Schema({
    email: {type: String, required: true}, // Both required
    password: {type: String, required: true},
});

// Encrypt and hash password and salt db
schema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// Check if correct password
schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', schema);