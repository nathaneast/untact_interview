const mongoose = require('mongoose');
const dayjs = require('dayjs');

const FeedbackPostSchema = new mongoose.Schema(
  {
    answers: {
      type: Array,
      required: true,
    },
    feedbacks: {
      type: Array,
      required: true,
    },
    createdAt: {
      type: String,
      default: dayjs().format('YYYY-MM-DD'),
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    sessionPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  },
  {
    versionKey: false,
  }
);

const FeedbackPost = mongoose.model('feedbackPost', FeedbackPostSchema);

module.exports = FeedbackPost;
