var db = require('../models');

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('join room', function(data) {
      socket.join(data.room);
    });

    socket.on('leave room', function(data) {
      socket.leave(data.room);
    });

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
        db.comment.find({
          where: {id: comment.id},
          include: [db.user]
        }).then(function(comment) {
          io.in('question' + comment.questionId).emit('server comment', comment);
        });
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
};