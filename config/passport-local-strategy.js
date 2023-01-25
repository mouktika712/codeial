const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


// Authentication using passport

// we are telling passport to use localStrategy
passport.use(new LocalStrategy({
    // syntax...username in our case is the email id of user
        usernameField: 'email',
        passReqToCallback: true   // this aloows us to make the first arg as req
    },

    // done is the callback function which takes 2 args (err, ?)
    // email and the password are entered by the user (not from db)
    function(req, email, password, done) {
        // find the user and establish  the identity 
        User.findOne({email: email}, function (err, user) {
            // case 1: error in finding the user email in the db
            if(err) {
                req.flash('error', err);
                // even if done() takes 2 args we can pass only one due to JS
                // as the 2nd one will be undefined automatically
                return done(err);
            }

            // no error but authentication is not successfull!
            if(!user || user.password != password) {
                req.flash('error', err);
                // since there is no err we are passing null as the 1st arg
                // the 1st arg is always the err
                // And as the authentication was not successfull...we are passing false
                return done(null, false);
            }

            // no error and the user is authenticated successfully!
            // therefore we are passing the user to the done function
            return done(null, user);
        });
   
    }
));

// serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function (user, done) {
    // encryption is done automatically
    // null is passed as there is no error
    // user id is to be kept in the cookies
    done(null, user.id);
});

// deserializing the user from the key kept in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        if(err) {
            console.log('Error in finding the user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});


// check if the user is authenticated (this function is not an in-built function)
// this will be used as a middleware
passport.checkAuthentication = function (req, res, next) {
    // if the user is signed in, then pass on the request to the next function i.e. Controller's Action
    if(req.isAuthenticated()) {
        // inbuilt method added by passport
        return next();
    }

    // if the user is not signed in...redirect the request back to the sign-in page
    return res.redirect('/users/sign-in');
}



// req.user contains the current signed in user from the session-cookie & we are just sending this to the locals for the views (ejs files)
passport.setAuthenticatedUser = function (req, res, next) {
    // whenever the user is signed in(authenticated)...req.user is set to the current user by passport
    // as we need to access the user in out ejs file, we need to set the user.locals.user to req.user
    if(req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;


/*What does Passport authenticate () do?
Image result for passport.initialize()
In this route, passport. authenticate() is middleware which will authenticate the request. By default, when authentication succeeds,
 the req. user property is set to the authenticated user, a login session is established, and the next function in the stack is 
 called.*/