'use strict';
module.exports = function(sequelize, DataTypes) {
  var alert = sequelize.define('alert', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.alert.belongsTo(models.user);
      }
    }
  });
  return alert;
};