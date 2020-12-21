const passport = require('passport');
const local = require('./local');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    // console.log(user, 'serializeUser')
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      // console.log(user, 'deserializeUser user')
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
