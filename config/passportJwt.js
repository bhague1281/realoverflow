var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var db = require('../models');

passport.use(new JwtStrategy({
  secretOrKey: 'secret'
}, function(jwt_payload, done) {
  console.log(jwt_payload);
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