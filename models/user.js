'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.comment);
        models.user.hasMany(models.question);
        models.user.hasMany(models.alert);
      }
    },
    instanceMethods: {
      fullName: function() {
        return this.firstName + ' ' + this.lastName;
      },
      getWithNoPassword: function() {
        var user = this.get();
        delete user.password;
        return user;
      },
      checkPassword: function(password, callback) {
        if (password && this.password) {
          bcrypt.compare(password, this.password, callback);
        } else {
          callback(null, false);
        }
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback) {
        if (user.password) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback(null, user);
          });
        } else {
          callback(null, user);
        }
      }
    }
  });
  return user;
};