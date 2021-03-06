const mongoose = require('mongoose');

const FeedbackPostSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    timeStamps: {
      type: Array,
      required: true,
    },
    feedbacks: {
      type: Array,
      required: true,
    },
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
