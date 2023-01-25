const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // Path for the file will be stored in the Schema
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

// Join the AVATAR_PATH to storage (configuring storage for multer): given in the documentation of Multer
// In this storage we are setting (destination path to store + filename by which it will be stored)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path of where to store)
      cb(null, path.join(__dirname, AVATAR_PATH));
    },
    // creating a unique filename
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// static (attach the storage to multer RHS: this will be static for the USER Schema) 
// .single('fieldname') specifies that only a single file can be uploaded for the fieldname 'avatar'  
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
// we need to access this avatar path in users.controller to store the path in the user.avatar(schema) res. to each user
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;