var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('express-favicon');
var db = require('./models');
var passport = require('./config/passportJwt');
var tk = require('jsonwebtoken');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sockets = require('./controllers/websockets')(io);

app.set('superSecret', process.env.JWT_SYMMETRIC_KEY);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/static')));
app.use(favicon(__dirname + '/static/favicon.ico'));

app.post('/api/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      var serializedUser = user.getWithNoPassword();
      var token = tk.sign(serializedUser, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME // expires in 24 hours
      });
      res.send({
        success: true,
        message: 'User created!',
        token: token,
        user: serializedUser
      });
    } else {
      res.status(401).send({message: 'A user with that email address already exists'});
    }
  }).catch(function(error) {
    if (error.message) {
      res.status(500).send({message: error.message});
    } else {
      res.status(500).send({message: 'An error occurred. Try again.'});
    }
  });
});

app.post('/api/login', function(req, res) {
  db.user.find({ where: {email: req.body.email}}).then(function(user) {
    if (!user) {
      res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
    } {
      user.checkPassword(req.body.password, function(err, result) {
        if (err || !result) {
          res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = tk.sign(user.getWithNoPassword(), process.env.JWT_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION_TIME // expires in 24 hours
          });

          res.send({
            success: true,
            message: 'Authenticated!',
            token: token
          });
        }
      });
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/protected', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.send(req.user);
});

app.use('/api/users', passport.authenticate('jwt', {session: false}), require('./controllers/user'));
app.use('/api/questions', require('./controllers/question'));
app.use('/api/alerts', passport.authenticate('jwt', {session: false}), require('./controllers/question'));

// Requests that don't match any of the above should be sent to index
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

http.listen(process.env.PORT || 3000);





