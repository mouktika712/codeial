const express = require("express");
const router = express.Router();
const postsApi = require("../../../controllers/api/v1/posts_api");
// this is /posts part : / --> /posts/
// url: localhost:8000/api/v1/posts

router.get("/", postsApi.index);
router.delete("/:id", postsApi.destroy);

module.exports = router;
