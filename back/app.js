const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
// const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const config = require('./config');
const { MONGO_URI, PORT, COOKIE_SECRET } = config;

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const passportConfig = require('./passport');

const app = express();
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connecting Success!'))
  .catch((e) => console.error(e));
passportConfig();

// production, dev 설정
app.use(morgan('dev'));
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: COOKIE_SECRET,
  // proxy: true,
  // cookie: {
    // httpOnly: true,
  //   secure: false,
  // },
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('untect_interview_backend_server !');
});
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);

app.listen(PORT, () => {
  console.log(`${PORT} 서버 실행중 !`);
});
