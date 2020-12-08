const mongoose = require('mongoose');
const dayjs = require('dayjs');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questons: {
    type: Array,
    required: true,
  },
  desc: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: dayjs().format('YYYY-MM-DD'),
  },
  star: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
    },
}, {
  versionKey: false 
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
