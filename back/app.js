const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');

const config = require('./config');
const { MONGO_URI, PORT, COOKIE_SECRET } = config;

const userRouter = require('./routes/user');
const sessionPostRouter = require('./routes/sessionPost');
const feedbackPostRouter = require('./routes/feedbackPost');
const postsRouter = require('./routes/posts');
const passportConfig = require('./passport');
const socket = require('./socket');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connecting Success!'))
  .catch((e) => console.error(e));
passportConfig();

if (process.env.NODE_ENV === 'production') {
  // app.set('trust proxy', 1);
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
  app.use(cors({
    origin: ['http://localhost:3000', 'http://3.35.175.12'],
    credentials: true,
  }));
} else {
  app.use(morgan('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: COOKIE_SECRET,
    // proxy: true,
    // cookie: {
    // httpOnly: true,
    //   secure: false,
    // },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('untect_interview_backend_server !');
});
app.use('/user', userRouter);
app.use('/sessionPost', sessionPostRouter);
app.use('/feedbackPost', feedbackPostRouter);
app.use('/posts', postsRouter);

socket(io);

server.listen(PORT, () => {
  console.log(`${PORT} 서버 실행중 !`);
});
