const express = require('express');

const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const allPosts = await Post.find()
      .populate('creator', 'nickname email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    return res.send(allPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 시간 포맷 제대로 저장 안되서 중복 발생
// 인피니티 스크롤때 같은 날짜가져옴 오류 해결하기
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
    return res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
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

    const post = await Post.findById(postId);
    const isStaredUser = post.star.some((user) => user === userId);
    const update = isStaredUser
      ? {
          $pull: {
            star: userId,
          },
        }
      : {
          $push: {
            star: userId,
          },
        };
    const updatePost = await Post.findByIdAndUpdate(postId, update, { new: true });

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
