const Like = require("../models/like");
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.toggleLike = async function (req, res) {
  try {
    //url will be smthng like this:  likes/toggle/?id=abcde&type=Post
    let likeable;
    let deleted = false;

    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    // check if a already exists
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });

    // is a like already exists delete it else create a like
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();
      deleted = true;
    } else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(like._id);
      likeable.save();
    }

    return res.status(200).json({
      message: "Request Successful!",
      data: {
        deleted,
      },
    });
  } catch (err) {
    console.log("Error in adding a like", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
