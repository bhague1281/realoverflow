var express = require('express');
var db = require('../models');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    db.user.findAll().then(function(users) {
      users = users.map(function(user) {
        return user.getWithNoPassword();
      })
      res.send(users);
    });
  })
  .post(function(req, res) {
    db.user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    }).then(function(user) {
      res.send(user.getWithNoPassword());
    });
  });

router.route('/:userId')
  .get(function(req, res) {
    db.user.findById(req.params.userId).then(function(user) {
      res.send(user.getWithNoPassword());
    });
  })
  .put(function(req, res) {
    db.user.findById(req.params.userId).then(function(user) {
      user.setAttributes(req.body).then(function(user) {
        res.send(user.getWithNoPassword());
      });
    })
  })
  .delete(function(req, res) {
    db.user.destroy({where: {id: req.params.userId}}).then(function() {
      res.status(200).send();
    });
  });

module.exports = router;