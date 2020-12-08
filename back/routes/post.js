const express = require("express");
const dayjs = require("dayjs");

const Post = require("../models/post");
const Category = require("../models/category");
const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allPosts = await Post.find()
      .sort({ date: -1 })
      .populate("star", "email")
      .populate("userId", "nickname email")
      .populate("category", "name");
    return res.json(allPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { userId, questions, title, desc, category } = req.body;
    console.log(userId, questions, title, desc, category, "req.body");
    const newPost = await Post.create({
      userId,
      questions,
      title,
      desc,
      createdAt: dayjs().format("YYYY-MM-DD"),
    });
    const findCategory = await Category.findOne({
      name: category,
    });
    if (findCategory) {
      await Post.findByIdAndUpdate(newPost._id, {
        category: findCategory._id,
      });
      await Category.findByIdAndUpdate(findCategory._id, {
        $push: {
          posts: newPost._id,
        },
      });
    } else {
      const newCategory = await Category.create({
        name: category,
      });
      await Post.findByIdAndUpdate(newPost._id, {
        category: newCategory._id,
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: {
          posts: newPost._id,
        },
      });
    }
    await User.findByIdAndUpdate(userId, {
      $push: {
        posts: newPost._id,
      },
    });
    return res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
