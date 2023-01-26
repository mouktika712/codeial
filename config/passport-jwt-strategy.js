const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// JWT Structure: Header . Payload . Signature

const User = require("../models/user");

console.log("jwt is beig used here for user authentication");


let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "codeial",
};

passport.use(
  new JWTStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);


module.exports = passport;

/*
// this code is for the case when the user already has his jwt and we are 
just authenticating the user using jwt coming from req.header
passport.use(jwtStrategy);

opts = {
  extract the jwt from header using Extractjwt of passport-jwt,
  set a secret key
}
jwtStrategy = new JWTStrategy(opts, callback);

const callback = function (jwtPayload, done function) {
  find the user by id (compare database id with payload id){
    if error : pass error, false
    if there is no error: pass null as 1st arg: {
      if user found pass the user as the second arg 
      else pass false(not found)
    }
    done takes 2 args: done(err, user)
  }
}
*/
