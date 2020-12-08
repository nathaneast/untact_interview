const express = require('express');
const dayjs = require('dayjs');

const Post = require('../models/post');
const Category = require('../models/Category');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { userId, questions, title, desc, category } = req.body;
    const newPost = await Post.create({
      userId,
      questions,
      title,
      desc,
      createdAt: dayjs().format('YYYY-MM-DD'),
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
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
