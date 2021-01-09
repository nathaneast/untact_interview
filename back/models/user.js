const mongoose = require("mongoose");
// const dayjs = require("dayjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    // createdAt: {
    //   type: String,
    //   default: dayjs().format("YYYY-MM-DD"),
    // },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    feedbackPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feedbackPost",
      },
    ],
    starPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
