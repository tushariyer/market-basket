// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// Instance vars
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expresshbs = require('express-handlebars'); // handlebars
var passport = require('passport'); // passport for user auth
var mongoose = require('mongoose'); // MongoDB connections
var validity = require('express-validator'); // Validation package
var flash = require('connect-flash'); // For the error alerts
var session = require('express-session'); // To make passport use sessions

// This var is to optimize session storage and prevent memory leaks
var mongoStorage = require('connect-mongo')(session); // To use mongo as session storage rather than memory

var indexRouter = require('./routes/index'); // Index page router
var userRouter = require('./routes/user'); // User pages router

var app = express();

mongoose.connect('mongodb://localhost:27017/marketbasket', {
    useNewUrlParser: true
}); // Connect to db
require('./config/passport'); // Load passport config rules

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expresshbs({
    defaultLayout: 'layout',
    extname: '.hbs'
})); // Use the new handlebars, but use the old .hbs filetype
app.set('view engine', '.hbs'); // Set engine

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(validity()); // Init validator
app.use(cookieParser());
app.use(session({
    secret: 'mongodbproject',
    resave: false,
    saveUninitialized: false,
    store: new mongoStorage({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 120 * 60 * 1000 // 120 minute lifetime
    }
})); // Session secret
app.use(flash()); // Init flash
app.use(passport.initialize()); // Init passports
app.use(passport.session()); // Init passport-session connection
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated(); // Essentially resolve to T or F
    res.locals.session = req.session; // Make the session available to 'views' so we can use it with handlebars
    next(); // continue
});

app.use('/user', userRouter); // This dir is user dir
app.use('/', indexRouter); // This dir is index dir

// HTTP 404 response
app.use(function (req, res, next) {
    next(createError(404));
});

// Catch all errors
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
