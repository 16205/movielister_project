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
}