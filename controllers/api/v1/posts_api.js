const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

// express deprecated res.json(status, obj): Use res.status(status).json(obj) instead
module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt") //Acc to the mongo db...and prepend acc to the ajax
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  return res.status(200).json({
    message: "List of Posts",
    posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    post.remove();

    await Comment.deleteMany({ post: req.params.id });

    return res.status(200).json({
      message: "Posts and assciated comments deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
