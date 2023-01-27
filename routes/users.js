const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");

//url : /users/profile --> this route will not work as this is diff from -->  /users/profile/:id (This route will only work for q params)
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);

router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

router.post("/create", usersController.create);

// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

/* this url is provided by google (scope obj tells google what info is needed to us): 
we will create a btn with this route in our views: sign-in and sign-up page */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// this is the callback we will get through google (if auth is successful : session will be created) otherwise in case of failure...we will redirect the user to sign-in page
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

module.exports = router;
