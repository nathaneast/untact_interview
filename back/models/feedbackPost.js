const mongoose = require('mongoose');
const dayjs = require('dayjs');

const FeedbackPostSchema = new mongoose.Schema({
  feedbacks: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: dayjs().format('YYYY-MM-DD'),
  },
  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  postId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
});

const FeedbackPost = mongoose.model('feedbackPost', FeedbackPostSchema);

module.exports = FeedbackPost;
