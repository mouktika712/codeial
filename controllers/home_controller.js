const Post = require("../models/post");
const User = require("../models/user");
const flash = require("connect-flash");

// telling the browser..this function contains async functions
module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
    // Await for this function to get completed
    let posts = await Post.find({})
      .sort("-createdAt") //Acc to the mongo db...and prepend acc to the ajax
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    // the callback for find is not needed in case of await...the result will be stored in the variable
    // Then wait for this to get completed
    let users = await User.find({});
    // On the homepage we are showing the friends of the current logged in user
    // but in order to do that we need to "find" all the users...and pass them to the ejs file

    // then execute this
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });

    // if any error occurs in the code above...that err is caught here
  } catch (err) {
    console.log("Error", err);
    return;
  }
};

// module.exports.actionName = function(req, res){}
