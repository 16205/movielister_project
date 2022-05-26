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
        foreignKey: 'movieId'
      });
      models.movie_has_genres.belongsTo(models.genre, {
        foreignKey: 'genreId'
      });
    }
  }
  movie_has_genres.init({
    movieId: DataTypes.INTEGER,
    genreId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'movie_has_genres',
  });
  return movie_has_genres;
};