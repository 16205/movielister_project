'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie_has_genres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.movie_has_genres.belongsTo(models.movie, {
        foreignKey: 'movies_id'
      });
      models.movie_has_genres.belongsTo(models.genre, {
        foreignKey: 'genres_id'
      });
    }
  }
  movie_has_genres.init({
    movies_id: DataTypes.INTEGER,
    genres_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'movie_has_genres',
  });
  return movie_has_genres;
};