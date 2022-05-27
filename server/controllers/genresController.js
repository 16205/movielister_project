// Imports
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Constants

// Routes
module.exports = {
    getAllGenres: function (req, res) {
        models.genre.findAll({
            order: [['name', 'ASC']],
            attributes: ['name'],
            include: [{
                model: models.movie,
                attributes: ['title'],
                through: {
                    attributes: []
                }
            }]
        })
        .then(function (genres) {
            if (genres) {
                return res.status(200).json(genres);
            } else {
                return res.status(404).json({ 'message': 'No genres found' });
            }
        })
        .catch(function (err) {
            return res.status(500).json({ 'error': 'Unable to fetch genres' });
        });
    },

    updateGenre: function(req, res) {
        // Get auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        // Check if userId has been verified
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Params
        var id = req.body.id;
        var newName = req.body.name;
        
        models.genre.findOne({
            where: {
                id: id
            }
        })
        .then(function (genre) {
            if (genre) {
                genre.update({
                    name: newName
                })
                .then(function (genre) {
                    return res.status(200).json(genre);
                })
                .catch(function (err) {
                    return res.status(500).json({ 'error': 'Unable to update genre' });
                });
            } else {
                return res.status(404).json({ 'error': 'Genre not found' });
            }
        })
        .catch(function (err) {
            return res.status(500).json({ 'error': 'Unable to fetch genre' });
        });
    }
}