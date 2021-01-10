const mongoose = require("mongoose");
// const dayjs = require("dayjs");

const SessionPostSchema = new mongoose.Schema(
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
    // createdAt: {
    //   type: String,
    //   default: dayjs().format("YYYY-MM-DD"),
    // },
    star: { 
      type: mongoose.Schema.Types.Mixed, 
      default: [],
    },
    // star: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "user",
    //   },
    // ],
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
    minimize: false,
    timestamps: true,
  }
);

const SessionPost = mongoose.model("sessionPost", SessionPostSchema);

module.exports = SessionPost;
