'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.changeColumn(
      'questions',
      'score',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      }
    );
    queryInterface.changeColumn(
      'comments',
      'score',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.changeColumn(
      'questions',
      'score',
      {
        type: Sequelize.INTEGER
      }
    );
    queryInterface.changeColumn(
      'questions',
      'score',
      {
        type: Sequelize.INTEGER
      }
    );
  }
};
