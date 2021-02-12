const express = require('express');

const SessionPost = require('../models/sessionPost');
const Category = require('../models/category');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lastId, category } = req.query;
    if (category === 'all') {
      const allPosts = await SessionPost.find(lastId ? { _id: { $lt: lastId } } : null)
        .limit(8)
        .populate('creator', 'nickname email')
        .populate('category', 'name')
        .sort({ createdAt: -1 });
      return res.status(200).send(allPosts);
    } else {
      const categoryPosts = await Category.findOne({
        name: category
      })
      .populate({
        path : 'posts',
        select: 'title desc createdAt star',
        match: lastId ? { _id: { $lt: lastId } } : null,
        options: { 
          sort: { 'createdAt': -1 },
          limit: 8,
        },
        populate : {
          path : 'creator',
          select: 'email nickname',
        },
      })

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
    if (category === 'feedback') {
    const userPosts = await User.findById(userId)
      .select('_id')
      .populate({
        path : 'feedbackPosts',
        select: '_id desc',
        match: lastId ? { _id: { $lt: lastId } } : null,
        options: {
          sort: { createdAt: -1},
          limit: 8,
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

      return res.status(200).send(userPosts ? userPosts.feedbackPosts : []);
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
          sort: { createdAt: -1 },
          limit: 8,
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

      return res.status(200).send(userPosts[targetPost] ? userPosts[targetPost] : []);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
