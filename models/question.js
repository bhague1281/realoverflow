'use strict';
module.exports = function(sequelize, DataTypes) {
  var question = sequelize.define('question', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 10,
          msg: 'Comment must have at least 10 characters'
        }
      }
    },
    answered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.question.hasMany(models.comment);
        models.question.belongsTo(models.user);
      }
    }
  });
  return question;
};