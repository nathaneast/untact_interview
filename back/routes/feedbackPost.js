const express = require('express');

const User = require('../models/user');
const FeedbackPost = require('../models/feedbackPost');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { creatorId, sessionPostId, timeStamps, feedbacks, feedbackDesc } = req.body;
    const newFeedback = await FeedbackPost.create({
      timeStamps,
      feedbacks,
      creator: creatorId,
      sessionPost: sessionPostId,
      desc: feedbackDesc,
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

router.get('/:feedbackPostId', isLoggedIn, async (req, res, next) => {
  try {
    const { feedbackPostId } = req.params;
    const feedbackPost = await FeedbackPost.findById(feedbackPostId)
      .populate('creator', 'nickname email')
      .populate({
        path: 'sessionPost',
        populate: [
          {
            path: 'creator',
            select: 'email nickname',
          },
          {
            path: 'category',
            select: 'name',
          },
        ],
      });
    console.log(feedbackPost, 'feedbackPost');
    return res.status(200).send(feedbackPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
