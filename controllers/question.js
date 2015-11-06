var express = require('express');
var db = require('../models');
var passport = require('../config/passportJwt');
var questionRouter = express.Router();
var commentRouter = express.Router({mergeParams: true});

questionRouter.use('/:questionId/comments', commentRouter);

questionRouter.route('/')
  .get(function(req, res) {
    var params = {
      include: [db.user],
      order: '"createdAt" DESC'
    };

    if (req.query.offset) params.offset = req.query.offset;
    if (req.query.limit) params.limit = req.query.limit;

    db.question.findAll(params).then(function(questions) {
      res.send(questions);
    });
  })
  .post(passport.authenticate('jwt', {session: false}), function(req, res) {
    db.question.create(req.body).then(function(question) {
      db.question.find({
        where: {id: question.id},
        include: [db.user]
      }).then(function(question) {
        res.send(question);
      });
    });
  });

questionRouter.route('/:questionId')
  .get(function(req, res) {
    db.question.find({
      where: {id: req.params.questionId},
      include: [db.user],
      order: '"createdAt" DESC'
    }).then(function(question) {
      res.send(question);
    });
  })
  .put(passport.authenticate('jwt', {session: false}), function(req, res) {
    db.question.findById(req.params.questionId).then(function(question) {
      question.setAttributes(req.body).then(function(question) {
        res.send(question);
      });
    })
  })
  .delete(passport.authenticate('jwt', {session: false}), function(req, res) {
    db.question.destroy({where: {id: req.params.questionId}}).then(function() {
      res.status(200).send();
    });
  });

questionRouter.post('/:questionId/up', function(req, res) {
  db.question.findById(req.params.questionId).then(function(question) {
    question.score += 1;
    question.save().then(function() {
      res.send({message: 'Upvoted to ' + question.score})
    })
  });
});

questionRouter.post('/:questionId/down', function(req, res) {
  db.question.findById(req.params.questionId).then(function(question) {
    question.score -= 1;
    question.save().then(function() {
      res.send({message: 'Downvoted to ' + question.score})
    })
  });
});

commentRouter.route('/')
  .get(function(req, res) {
    db.comment.findAll({
      where: {questionId: req.params.questionId},
      include: [db.user],
      order: '"createdAt" DESC'
    }).then(function(comments) {
      res.send(comments);
    });
  })
  .post(passport.authenticate('jwt', {session: false}), function(req, res) {
    db.comment.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      questionId: req.params.questionId
    }).then(function(comment) {
      res.send(comment);
    });
  });

commentRouter.route('/:commentId')
  .get(function(req, res) {
    db.comment.findById(req.params.commentId).then(function(comment) {
      res.send(comment);
    });
  })
  .put(function(req, res) {
    db.comment.findById(req.params.commentId).then(function(comment) {
      comment.setAttributes(req.body).then(function(comment) {
        res.send(comment);
      });
    })
  })
  .delete(function(req, res) {
    db.comment.destroy({where: {id: req.params.commentId}}).then(function() {
      res.status(200).send();
    });
  });

module.exports = questionRouter;