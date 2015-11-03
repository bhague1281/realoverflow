var express = require('express');
var bodyParser = require('body-parser');
var db = require('./models');
var passport = require('./config/passportJwt');
var tk = require('jsonwebtoken');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sockets = require('./controllers/websockets')(io);

app.set('view engine', 'ejs');
app.set('superSecret', 'secret');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));

app.post('/api/signup', function(req, res) {
  db.user.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  }).then(function(user) {
    var token = tk.sign(user, app.get('superSecret'), {
      expiresIn: 1440 // expires in 24 hours
    });
    var serializedUser = user.getWithNoPassword();
    serializedUser.token = token;
    res.send(serializedUser);
  });
});

app.post('/api/login', function(req, res) {
  db.user.find({ where: {email: req.body.email}}).then(function(user) {
    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } {
      user.checkPassword(req.body.password, function(err, result) {
        if (err || !result) {
          res.send({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = tk.sign(user.getWithNoPassword(), app.get('superSecret'), {
            expiresIn: 1440 // expires in 24 hours
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
  res.render('index');
});

app.get('/api/protected', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.send(req.user);
});

app.use('/api/users', passport.authenticate('jwt', {session: false}), require('./controllers/user'));
app.use('/api/questions', require('./controllers/question'));
app.use('/api/alerts', passport.authenticate('jwt', {session: false}), require('./controllers/question'));

// Requests that don't match any of the above should be sent to index
app.use(function(req, res) {
  res.render('index');
});

http.listen(process.env.PORT || 3000);





