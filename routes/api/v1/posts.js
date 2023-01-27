const express = require("express");
const router = express.Router();
const passport = require("passport");
const postsApi = require("../../../controllers/api/v1/posts_api");
// this is /posts part : / --> /posts/
// url: localhost:8000/api/v1/posts

// to prevent session cookies from being generated we are setiing session: false
router.get("/", postsApi.index);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postsApi.destroy
);

module.exports = router;
