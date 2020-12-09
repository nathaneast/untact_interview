const mongoose = require("mongoose");
const dayjs = require("dayjs");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    desc: {
      type: String,
    },
    createdAt: {
      type: String,
      default: dayjs().format("YYYY-MM-DD"),
    },
    star: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    versionKey: false,
  }
);

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
