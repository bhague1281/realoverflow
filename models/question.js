'use strict';
module.exports = function(sequelize, DataTypes) {
  var question = sequelize.define('question', {
    content: DataTypes.TEXT,
    answered: DataTypes.BOOLEAN,
    score: DataTypes.INTEGER,
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