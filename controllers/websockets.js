var db = require('../models');

module.exports = function(io) {
  // stores the sockets/requests
  var RateLimiter = function() {
    this.sockets = {};
    this.requestLimit = 50;
    this.addHit = function(socketId) {
      if (this.sockets[socketId]) {
        this.sockets[socketId] += 1;
      } else {
        this.sockets[socketId] = 1;
      }
    };
    this.cutOffSocket = function(socketId) {
      this.addHit(socketId);
      return this.sockets[socketId] > this.requestLimit ? true : false;
    };
  }

  var rateLimit = new RateLimiter();

  // start interval to reset requests every day
  var limitInterval = setInterval(function() {
    rateLimit.sockets = {};
  }, 8640000);

  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('join room', function(data) {
      socket.join(data.room);
    });

    socket.on('leave room', function(data) {
      socket.leave(data.room);
    });

    socket.on('new question', function(question) {
      if (rateLimit.cutOffSocket(socket.id)) return socket.emit('alert', {type: 'danger', message:'You\'ve reached the request limit for the day'});

      db.question.create(question).then(function(question) {
        db.question.find({
          where: {id: question.id},
          include: [db.user]
        }).then(function(question) {
          io.emit('server question', question);
        }).catch(function(err) {
          socket.emit('alert', {type: 'danger', message: err.message});
        });
      }).catch(function(err) {
        socket.emit('alert', {type: 'danger', message: err.message});
      });
    });

    socket.on('new comment', function(comment) {
      if (rateLimit.cutOffSocket(socket.id)) return socket.emit('alert', {type: 'danger', message:'You\'ve reached the request limit for the day'});
      
      db.comment.create(comment).then(function(comment) {
        db.comment.find({
          where: {id: comment.id},
          include: [db.user]
        }).then(function(comment) {
          io.in('question' + comment.questionId).emit('server comment', comment);
        }).catch(function(err) {
          console.log(err);
          socket.emit('alert', {type: 'danger', message: err.message});
        });
      }).catch(function(err) {
        console.log(err);
        socket.emit('alert', {type: 'danger', message: err.message});
      });
    });

    socket.on('new alert', function(alert) {
      if (rateLimit.cutOffSocket(socket.id)) return socket.emit('alert', {type: 'danger', message:'You\'ve reached the request limit for the day'});

      console.log('new alert created', alert);
      db.alert.create(alert).then(function(alert) {
        io.emit('server alert', alert);
      });
    });

    socket.on('disconnect', function() {
      console.log('disconnected');
    });
  });
};