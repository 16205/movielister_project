const Sequelize = require('sequelize');

module.exports = new Sequelize('movielister', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});