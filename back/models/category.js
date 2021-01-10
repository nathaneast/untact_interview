const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "others",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sessionPost",
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;
