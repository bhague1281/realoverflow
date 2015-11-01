'use strict';
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
      }
    }
  });
  return user;
};