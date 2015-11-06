'use strict';
module.exports = function(sequelize, DataTypes) {
  var alert = sequelize.define('alert', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 10,
          msg: 'Alert must have at least 10 characters'
        }
      }
    },
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