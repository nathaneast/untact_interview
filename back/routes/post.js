const express = require('express');
const dayjs = require('dayjs');

const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 내림차순으로 post 받아오기
router.get('/', async (req, res, next) => {
  try {
    const allPosts = await Post.find()
      .populate('star', 'email')
      .populate('creator', 'nickname email')
      .populate('category', 'name')
      .sort({ date: -1 });
    return res.json(allPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { creator, questions, title, desc, category } = req.body;
    const newPost = await Post.create({
      creator,
      questions,
      title,
      desc,
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
    await User.findByIdAndUpdate(creator, {
      $push: {
        posts: newPost._id,
      },
    });

    // 홈에 LOAD_POST 서버사이드 적용 전 임시
    const fullPost = await Post.findById(newPost._id)
      .populate('star', 'email')
      .populate('creator', 'email nickname')
      .populate('category', 'name');
    return res.status(201).send(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
