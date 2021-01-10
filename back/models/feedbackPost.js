const mongoose = require('mongoose');
const dayjs = require('dayjs');

const FeedbackPostSchema = new mongoose.Schema(
  {
    timeStamps: {
      type: Array,
      required: true,
    },
    feedbacks: {
      type: Array,
      required: true,
    },
    // createdAt: {
    //   type: String,
    //   default: dayjs().format('YYYY-MM-DD hh:mm:ss'),
    // },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    sessionPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sessionPost',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const FeedbackPost = mongoose.model('feedbackPost', FeedbackPostSchema);

module.exports = FeedbackPost;
