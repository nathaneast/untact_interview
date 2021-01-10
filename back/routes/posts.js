const express = require('express');

const SessionPost = require('../models/sessionPost');
const Category = require('../models/category');
const User = require('../models/user');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lastId, category } = req.query;
    console.log(lastId, category, 'GET posts / req.query');
    if (category === 'all') {
      const allPosts = await SessionPost.find(lastId ? { _id: { $lt: lastId } } : null)
        .limit(5)
        .populate('creator', 'nickname email')
        .populate('category', 'name')
        .sort({ createdAt: -1 });
      return res.status(200).send(allPosts);
    } else {
      // 다른 카테고리일때
      const categoryPosts = await Category.findOne({
        name: category
      })
      .populate({
        path : 'posts',
        select: 'title desc createdAt star',
        match: lastId ? { _id: { $lt: lastId } } : null,
        options: { 
          sort: { 'createdAt': -1 },
          limit: 5,
        },
        populate : {
          path : 'creator',
          select: 'email nickname',
        },
      })

      console.log('categoryPosts', categoryPosts);

      return res.status(200).send(categoryPosts ? categoryPosts.posts : []);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { lastId, category } = req.query;
    console.log(userId, lastId, category, 'posts/:userId - userId, lastId, category');

  if (category === 'feedback') {
    const userPosts = await User.findById(userId)
      .select('_id')
      .populate({
        path : 'feedbackPosts',
        select: '_id',
        match: lastId ? { _id: { $lt: lastId } } : null,
        options: {
          sort: { createdAt: -1},
          limit: 5,
        },
        populate: [
          { 
            path : 'sessionPost',
            select: 'title desc createdAt star',
            populate: [
              { 
                path : 'creator',
                select: 'email nickname',
              },
              { 
                path : 'category',
                select: 'name',
              }
          ],
          }
      ],
      });

      console.log(userPosts.feedbackPosts, 'feedback Post');
      return res.status(200).send(userPosts.feedbackPosts ? userPosts.feedbackPosts : []);
    } else {
      const targetPost = category === 'writePosts' ? 'sessionPosts' : 'starPosts';
      const match = lastId ? { _id: { $lt: lastId } } : null;
      const userPosts = await User.findById(userId)
      .select('_id')
      .populate({
        path: targetPost,
        select: '-questions',
        match,
        options: {
          sort: { createdAt: -1},
          limit: 5,
        },
        populate: [
          { 
            path : 'creator',
            select: 'email nickname',
          },
          { 
            path : 'category',
            select: 'name',
          }
      ],
      });
      console.log(userPosts[targetPost], 'userPosts Post');
      return res.status(200).send(userPosts[targetPost] ? userPosts[targetPost] : []);
    }
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
