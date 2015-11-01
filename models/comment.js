'use strict';
module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
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