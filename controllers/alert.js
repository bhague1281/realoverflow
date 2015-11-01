var express = require('express');
var db = require('../models');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    db.alert.findAll().then(function(alerts) {
      res.send(alerts);
    });
  })
  .post(function(req, res) {
    db.alert.create({
      content: req.body.content,
      userId: req.body.userId
    }).then(function(alert) {
      res.send(alert);
    });
  });

router.route('/:alertId')
  .get(function(req, res) {
    db.alert.findById(req.params.alertId).then(function(alert) {
      res.send(alert);
    });
  })
  .put(function(req, res) {
    db.alert.findById(req.params.alertId).then(function(alert) {
      alert.setAttributes(req.body).then(function(alert) {
        res.send(alert);
      });
    })
  })
  .delete(function(req, res) {
    db.alert.destroy({where: {id: req.params.alertId}}).then(function() {
      res.status(200).send();
    });
  });

module.exports = router;