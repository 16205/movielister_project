'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movie_has_genres', {
      movies_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'movies',
          key: 'id'
        }
      },
      genres_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'genres',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('movie_has_genres');
  }
};