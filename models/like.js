const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
    },
    // this defines the objectId of the like object
    likable: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: "onModel",
    },
    // this field is used for defining the type of the liked object since this is the dynamic ref
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
