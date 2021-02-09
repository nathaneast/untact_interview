const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const redis = require('redis');

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

const io = require('socket.io')(server);

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

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
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
  app.use(cors({
    origin: 'http://localhost:3000',
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
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    resave: false,
    secret: COOKIE_SECRET,
    cookie: {
    httpOnly: true,
    secure: false,
    },
  })
);
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no'));
  }
  next();
})

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
