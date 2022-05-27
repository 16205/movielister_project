// Imports
var express = require('express');
var usersController = require('./controllers/usersController');
var moviesController = require('./controllers/moviesController');
var genresController = require('./controllers/genresController');

// Router
exports.router = (function() {
    var apiRouter = express.Router();

    // Users routes
    apiRouter.route('/users/register/').post(usersController.register);
    apiRouter.route('/users/login/').post(usersController.login);
    apiRouter.route('/users/').get(usersController.getAllUsers);
    apiRouter.route('/users/').get(usersController.getUserProfile);
    apiRouter.route('/users/me/').get(usersController.getUserProfile);
    apiRouter.route('/users/me/update').put(usersController.updateUserProfile);
    apiRouter.route('/users/me/delete').delete(usersController.deleteUser);
    
    // Movies routes
    apiRouter.route('/movies/new').post(moviesController.createMovie);
    apiRouter.route('/movies/').get(moviesController.getAllMovies);
    apiRouter.route('/movies/movie').get(moviesController.getMovie);
    apiRouter.route('/movies/update').put(moviesController.updateMovie);
    apiRouter.route('/movies/delete').delete(moviesController.deleteMovie);
    apiRouter.route('/movies/search').get(moviesController.getMovie);

    // Genres routes
    apiRouter.route('/genres/').get(genresController.getAllGenres);
    apiRouter.route('/genres/update').put(genresController.updateGenre);

    return apiRouter;
})();