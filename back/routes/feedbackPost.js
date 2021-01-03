const express = require('express');
const dayjs = require('dayjs');

const Post = require('../models/post');
const User = require('../models/user');
const FeedbackPost = require('../models/feedbackPost');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { creatorId, sessionPostId, answers, feedbacks } = req.body;
    const newFeedback = await FeedbackPost.create({
      answers,
      feedbacks,
      creator: creatorId,
      sessionPost: sessionPostId,
    });
    await User.findByIdAndUpdate(creatorId, {
      $push: {
        feedbackPosts: newFeedback._id,
      },
    });
    return res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get('/:postId', isLoggedIn, async (req, res, next) => {
//   try {
    // const post = await Post.findById(req.params.postId)
    //   .populate('star', 'email')
    //   .populate('creator', 'nickname email')
    //   .populate('category', 'name');
//     return res.send(post);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;
