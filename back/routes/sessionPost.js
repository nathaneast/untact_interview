const express = require('express');

const SessionPost = require('../models/sessionPost');
const Category = require('../models/category');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const allPosts = await SessionPost.find()
      .populate('creator', 'nickname email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    return res.send(allPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { creator, questions, title, desc, category } = req.body;
    const newPost = await SessionPost.create({
      creator,
      questions,
      title,
      desc,
    });
    const findCategory = await Category.findOne({
      name: category,
    });
    if (findCategory) {
      await SessionPost.findByIdAndUpdate(newPost._id, {
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
      await SessionPost.findByIdAndUpdate(newPost._id, {
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
        sessionPosts: newPost._id,
      },
    });
    return res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const post = await SessionPost.findById(req.params.postId)
      .populate('creator', 'nickname email')
      .populate('category', 'name');
    return res.send(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/star', isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await SessionPost.findById(postId);
    const isStaredUser = post.star.some((user) => user === userId);
    const update = (field, id) => (
      isStaredUser
        ? {
            $pull: {
              [field]: id,
            },
          }
        : {
            $push: {
              [field]: id,
            },
          }
    );
    const updatePost = await SessionPost.findByIdAndUpdate(
      postId,
      update('star', userId),
      { new: true }
    );
    await User.findByIdAndUpdate(
      userId,
      update('starPosts', postId),
      { new: true }
    );
    
    return res.status(200).send({
      postId: updatePost._id,
      star: updatePost.star,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
