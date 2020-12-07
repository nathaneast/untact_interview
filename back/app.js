const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');
const mongoose = require('mongoose');

const config = require('./config/index');
const { MONGO_URI, PORT, COOKIE_SECRET } = config;

const app = express();
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connecting Success !!'))
  .catch((e) => console.log(e));

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
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

//route
app.get('/', (req, res) => {
  res.send('untect_interview_backend_server !');
});

app.listen(PORT, () => {
  console.log(`${PORT} 서버 실행중 !`);
});
