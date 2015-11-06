'use strict';
module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define('comment', {
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
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.comment.belongsTo(models.question);
        models.comment.belongsTo(models.user);
      }
    }
  });
  return comment;
};