var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var tk = require('jsonwebtoken');
var db = require('./models');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var jwtCheck = jwt({
  secret: 'secret',
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

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
    var serializedUser = user.get();
    serializedUser.token = token;
    res.send(serializedUser);
  });
});

app.post('/api/login', function(req, res) {
  db.user.find({ where: {email: req.body.email}}).then(function(user) {
    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } {
      if (user.password != req.body.password) {
        res.send({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = tk.sign(user, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        res.send({
          success: true,
          message: 'Authenticated!',
          token: token
        });
      }
    }
  });
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/api/protected', jwtCheck, function(req, res) {
  res.send(req.user);
});

app.use('/api/users', jwtCheck, require('./controllers/user'));
app.use('/api/questions', jwtCheck, require('./controllers/question'));
app.use('/api/alerts', jwtCheck, require('./controllers/question'));


io.on('connection', function(socket) {
  console.log('connected');

  socket.on('new question', function(question) {
    console.log('new question created', question);
    db.question.create(question).then(function(question) {
      db.question.find({
        where: {id: question.id},
        include: [db.user]
      }).then(function(question) {
        io.emit('server question', question);
      })
    });
  });

  socket.on('new comment', function(comment) {
    console.log('new comment created', comment);
    db.comment.create(comment).then(function(comment) {
      io.emit('server comment', comment);
    });
  });

  socket.on('new alert', function(alert) {
    console.log('new alert created', alert);
    db.alert.create(alert).then(function(alert) {
      io.emit('server alert', alert);
    });
  });

  socket.on('disconnect', function() {
    console.log('disconnected');
  });
});

// Requests that don't match any of the above should be sent to index
app.use(function(req, res) {
  res.render('index');
});

http.listen(process.env.PORT || 3000);





