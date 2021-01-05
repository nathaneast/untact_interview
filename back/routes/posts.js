const express = require('express');

const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lastId, category } = req.query;
    console.log(lastId, category, 'req.query');
    if (category === 'all') {
      const posts = await Post.find(lastId ? { _id: { $lt: lastId } } : null)
        .limit(5)
        .populate('star', 'email')
        .populate('creator', 'nickname email')
        .populate('category', 'name')
        .sort({ createdAt: -1 });
      return res.status(200).send(posts);
    } else {
      // 다른 카테고리일때
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { lastId } = req.query;
    const { userId } = req.params.userId;
    console.log(userId, lastId, 'posts: userId userId');

    const userPosts = await User.findById(userId)
      .populate({
        path : 'posts',
        select: 'title desc createdAt star',
        option: {
          limit: 5,
          sort: { createdAt: -1},
          match: lastId ? { _id: { $lt: lastId } } : null,
        },
        populate : {
          path : 'creator',
          select: 'email nickname',
        },
        populate : {
          path : 'category',
          select: 'name',
        },
      });

    // if (category === 'all') {
    //   const posts = await Post.find(lastId ? { _id: { $lt: lastId } } : null)
    //     .limit(5)
    //     .populate('star', 'email')
    //     .populate('creator', 'nickname email')
    //     .populate('category', 'name')
    //     .sort({ createdAt: -1 });
    //   return res.status(200).send(posts);
    // } else {
    //   // 다른 카테고리일때
    // }

    console.log(userPosts, 'userPosts');

    // return res.send(userPosts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// {
//   "questions": "['ex1', 'ex2', 'ex3', 'ex4', 'ex5']",
//   "createdAt": "2020-12-10",
//   "star": "[]",
//   "creator": "5fd06f5faeb6ba3ae00cd447",
//   "title": "test글 1",
//   "desc": "test desc",
//   "category": "5fd08552207ecd10c8377ff2",
// }

module.exports = router;
