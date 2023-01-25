const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        comment: comment,
                        post: post
                    },
                    message: "Comment Created!"
                });
            }

            res.redirect('/');
        }
    }catch(err) {
        console.log('Error', err);
        return;
    }
}

// module.exports.create = function(req, res){
//     Post.findById(req.body.post, function(err, post){

//         if (post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comment){
//                 // handle error

//                 post.comments.push(comment);
//                 post.save();

//                 res.redirect('/');
//             });
//         }

//     });
// }

// this function will not delete the comment from the post schema's (comments array)...even if we delete the comment and it will not be shown on the website
// it will remain in the post schema 
// module.exports.destroy = function(req, res) {
//     Comment.findById(req.params.id, function(err, comment) {
//         // Adding Controller level check
//         if(comment.user == req.user.id) {
//             comment.remove();
//         }

//         return res.redirect('back');
//     });
// }


module.exports.destroy = async function(req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id) {
            let postId = comment.post;
            comment.remove();

            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
        }


        if(req.xhr) {
            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment Deleted!"
            })
        }

        console.log('ajax destroy not working');
        return res.redirect('back');
        
    }catch(err) {
        console.log('Error', err);
        return;
    }

}


// module.exports.destroy = function (req, res) {
//     Comment.findById(req.params.id, function(err, comment) {
//         if(comment.user == req.user.id) {
//             // Once the comment has been removed the post id linked with the comment will be lost as well
//             // but as we need the post id to delete the comment from the db (post schema's comment array)
//             // we are storing it in a variable beforehand
//             let postId = comment.post;

//             // remove the comment 
//             comment.remove();

//             // find the post by id and update the comments array for that post
//             Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, function(err, post) {
//                 return res.redirect('back');
//             })
//         }else {
//             return res.redirect('back');
//         }
//     });
// }