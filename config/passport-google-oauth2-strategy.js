const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// tell passport to use a new Strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        "311814670842-l2r9p7goq2cipbe6fndual35co67ltak.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },

    function (accessToken, refreshToken, profile, done) {
      // find the user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in google strategy-passport", err);
          return;
        }

        console.log(profile);

        if (user) {
          // if found, set this user as req.user(sign-in)
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user (sign-up)
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log("Error in creating user google passport");
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
