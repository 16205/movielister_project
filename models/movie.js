'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.movie.hasMany(models.movie_has_genres);
      models.movie.belongsTo(models.user, {
        foreignKey: 'users_id'
      });
    }
  }
  movie.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    director: DataTypes.STRING,
    year: DataTypes.INTEGER,
    users_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};