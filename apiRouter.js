// Imports
var express = require('express');
var usersController = require('./controllers/usersController');
var moviesController = require('./controllers/moviesController');

// Router
exports.router = (function() {
    var apiRouter = express.Router();

    // Users routes
    apiRouter.route('/users/register/').post(usersController.register);
    apiRouter.route('/users/login/').post(usersController.login);
    apiRouter.route('/users/me/').get(usersController.getUserProfile);
    apiRouter.route('/users/me/').put(usersController.updateUserProfile);
    
    // Movies routes
    apiRouter.route('/movies/new').post(moviesController.create);
    apiRouter.route('/movies/').get(moviesController.getAll);

    return apiRouter;
})();