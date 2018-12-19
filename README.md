# Marketbasket Application
## by Tushar Iyer


This is a basic market basket application that uses most of the MEAN stack. It is a simple online store complete with user login/authentication and payment verification through Stripe.

This is the root directory of the entire project. The files are listed as shown in the structure below. Please look at `package.json` to see the list of all NodeJS dependencies that will need to be installed.


# Installation and Run
 - Ensure that you have updated MongoDB installed and that you can navigate to the installation directory through either your IDE or the command line
 - Ensure that you have updated NodeJS, and have Express and Express-Generators installed
 - Open this project at this folder with your preferred IDE, we will use the terminal in the IDE window
 - In the IDE terminal, check that you are in mongo-market-basket dir and run this to install all NodeJS dependencies
   - `npm install`
 - Ensure that this happens without any errors (Error messages will only occur if you have installed Node/Mongo incorrectly)
 - In your MAIN command line window, start the MongoDB server with `mongod` or `./mongod` (This will show us connections to the DB)
 - In a SECOND command line window at the same location, run `mongo` or `./mongo` (This will allow us to see if there's anything in the DB)
 - In the IDE terminal pane, run this to populate the market basket db with products (and to init db)
   - `node seeder.js`
 - In the SECOND command line window run the following to access this database:
   - `use marketbasket`
 - You can query products with:
   - `db.products.find()`
 - You can query users with:
   - `db.users.find()`
 - You can query orders with:
   - `db.orders.find()`
 - In the IDE terminal pane, run this to start the application:
   - `npm start`
 - Navigate to `localhost:3000` in your web browser to use the application
 - The links on the top right allow you to access your basket, and see your account/log out (if logged in)
 - You can register yourself as a new user using the 'Register' link
 - Once you have an account, you can use the 'Login' link when you re-rerun the application as your account will persist
 - To stop the application, do so in the following order:
   -> In the IDE terminal pane, use 'Ctrl+C' to stop the Node application
   -> In the SECOND command line window, use 'Ctrl+C' to stop the `mongo`/`./mongo` connection
   -> In the MAIN command line window, use 'Ctrl+C' to stop the `mongod`/`./mongod` database

 - **OPTIONALLY**: Open three terminal windows within your IDE, and use them as follows:
   - Terminal One: `mongod` or `./mongod`
   - Terminal Two: `mongo` or `./mongo`
   - Terminal Three: `npm start`

 - **NOTE**: After going through this list the first time, you don't have to run `node seeder.js` again. The items will persist in MongoDB

**NPM [NodeJS] Dependencies**
- bcrypt-nodejs         - Version 0.0.3
- connect-flash         - Version 0.1.1
- connect-mongo         - Version 2.0.1
- cookie-parser         - Version 1.4.3
- csurf                 - Version 1.9.0
- debug                 - Version 2.6.9
- express               - Version 4.16.0
- express-handlebars    - Version 3.0.0
- express-session       - Version 1.15.6
- express-validator     - Version 5.3.0
- hbs                   - Version 4.0.1
- http-errors           - Version 1.6.2
- mongoose              - Version 5.3.6
- morgan                - Version 1.9.0
- passport              - Version 0.4.0
- passport-local        - Version 1.0.0
- stripe                - Version 6.15.0

You do not need to worry about these versions. If you have the latest version of Node, NPM and Express-Generators,
then `npm install` will take care of the dependency versions.

## Stripe Connection
This application was written such that payment transactions could be 'performed' using Stripe's test bench. This requires you to create a free account on Stripe and then do the following:

 - In `mongo-market-basket/routes/index.js` at line 114, you will need to enter the test token provided for YOUR Stripe account (As a string parameter). I have removed my own account token from this version.
 - In `mongo-market-basket/public/javascripts/checkout.js` at line 4, you will need to enter (as a string parameter) the test publishable key for YOUR Stripe account. I have removed my own account token from this version.
