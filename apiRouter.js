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
    apiRouter.route('/movies/').post(moviesController.create);

    return apiRouter;
})();