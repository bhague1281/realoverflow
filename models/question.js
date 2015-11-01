'use strict';
module.exports = function(sequelize, DataTypes) {
  var question = sequelize.define('question', {
    content: DataTypes.TEXT,
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
        models.question.belongsTo(models.user);
      }
    }
  });
  return question;
};