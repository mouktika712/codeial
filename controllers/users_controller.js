const User = require('../models/user');
const fs = require('fs'); // file system module
const path = require('path');


module.exports.profile = function(req, res){

// linking the friends list (names) to respective profiles
// req.params.id will contain the id of the user whose profile has been accessed
   
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}



// module.exports.update = function (req, res) {
//     // by using html if someone changes the user id in query params he/she will be able to update the profile of any other user
//     // keeping a Controller level check(if the current signed in user id is same as the one we are getting into the query params)
//     if(req.user.id == req.params.id) {

//         // this will find the user with id we got from the params and update it acc. to the req.body details
//         // note that...here, req.body contains the new values..that needs to be updated
//         // callback is same as before 
//         User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
//             return res.redirect('back');
//         });
//     }else {
//         return res.status(401).send('unauthorized');
//     } 
// }

module.exports.update = async function(req, res) {
    
    if(req.user.id == req.params.id) {
        try{
            /* in case of multipart form(data) we cannot access the params like we ususlly do for that we need to use 
            multer storage (which also takes the req as an arg)..see the uploadedAvatar() function*/
            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req, res, function(err){
                if(err) {
                    console.log("Multer Error", err);
                }
                console.log(req.file);
                // updating the user profile (multer processes the multipart form data and add it to the req.body)
                user.name = req.body.name;
                user.email = req.body.email;

                // similarly uploaded file is added to the req.file 
                // if the file is uploaded (user can chhose not to)
                if(req.file){
                    // if the user already has an avatar (we need to remove it and then save a new one)
                    if(user.avatar) {
                        // checking if the file exists on the specified path
                        if(fs.existsSync(path.join(__dirname, '../models', user.avatar))) {
                            fs.unlinkSync(path.join(__dirname, '../models', user.avatar));
                        }
                        
                    }


                    // storing the path as to where the file is stored for that user(we added a field "avatar" to the User Schema)
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }
}



// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}


module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
    
        let user = await User.findOne({email: req.body.email});
    
        if(!user) {
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        }else {
            return res.redirect('back');
        }
    }catch(err) {
        console.log('Error', err);
        return;
    }
}


// get the sign up data
// module.exports.create = function(req, res){
//     if (req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }

//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('error in finding user in signing up'); return}

//         if (!user){
//             User.create(req.body, function(err, user){
//                 if(err){console.log('error in creating user while signing up'); return}

//                 return res.redirect('/users/sign-in');
//             })
//         }else{
//             return res.redirect('back');
//         }

//     });
// }




// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // we are creating flash in req object as we need to notify the status of the req to the user
    // this is done when we receive the request...so flash is set up in req object
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.flash('success', 'Logged out Successfully');
    req.logout(function(err) {
        if(err) {
            console.log('Error in logging out the user');
        }
    });

    
    return res.redirect('/');
}

