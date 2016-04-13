var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var db = require('../models');

passport.use(new JwtStrategy({
  secretOrKey: process.env.JWT_SYMMETRIC_KEY
}, function(jwt_payload, done) {
  db.user.findById(jwt_payload.id).then(function(user) {
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  }).catch(function(err) {
    return done(err, false);
  });
}));

module.exports = passport;
