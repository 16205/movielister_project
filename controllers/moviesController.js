// Imports
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Constants
const TITLE_LIMIT = 80;
const DESCRIPTION_LIMIT = 1000;
const DIRECTOR_LIMIT = 50;
const YEAR_REGEX = /^[1-2][0,9][0-9][0-9]$/;

// Routes
module.exports = {
    getAll: function(req, res) {
        models.movie.findAll()
        .then(function(movies) {
            res.send(movies);
        })
        .catch(function(err) {
            res.send(err);
        });
    },

    getOne: function(req, res) {
        models.movie.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(function(movie) {
            res.send(movie);
        })
        .catch(function(err) {
            res.send(err);
        });
    },

    create: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var title       = req.body.title;
        var description = req.body.description;
        var director    = req.body.director;
        var year        = req.body.year;
        var genres      = req.body.genres;

        // Check for empty params
        if (title == null || director == null || year == null || genres == null) {
            return res.status(400).json({ 'error': 'Missing parameters' });
        }

        // Check for title length
        if (title.length > TITLE_LIMIT) {
            return res.status(400).json({ 'error': 'Title must be less than ' + TITLE_LIMIT + ' characters' });
        }

        // Check for description length
        if (description.length > DESCRIPTION_LIMIT) {
            return res.status(400).json({ 'error': 'Description must be less than ' + DESCRIPTION_LIMIT + ' characters' });
        }
        
        // Check for director length
        if (director.length > DIRECTOR_LIMIT) {
            return res.status(400).json({ 'error': 'Director must be less than ' + DIRECTOR_LIMIT + ' characters' });
        }

        // Check year format
        if (!YEAR_REGEX.test(year)) {
            return res.status(400).json({ 'error': 'Year must be a 4 digits number between 1900 and 2099' });
        }

        // Check for existing movie
        models.movie.findOne({
            where: { title: title }
        })
        .then(function(movieFound) {
            // If movie doesn't exist, create it, with userId
            if (!movieFound) {
                models.movie.create({
                    title: title,
                    description: (description ? description : description),
                    director: director,
                    year: year,
                    users_id: userId
                })
                // Add movie genre relationship
                .then(function(newMovie) {
                    // Iterate through given genres
                    genres.forEach(genre => {    
                        // Check for existing genre
                        models.genre.findOne({
                            where: { name: genre }
                        })
                        .then(function(genreFound) {
                            // If genre doesn't exist, create it
                            if (!genreFound) {
                                models.genre.create({
                                    name: genre
                                })
                                .then(function(newGenre) {
                                    // Create movie genre relationship in movie_has_genres table, from movie and newly created genre
                                    models.movie_has_genres.create({
                                        movies_id: newMovie.id,
                                        genres_id: newGenre.id
                                    })
                                    // Return movie, and movie genre relationship
                                    .then(function(movie_genres) {
                                        return res.status(201).json(newMovie, movie_genres);
                                    })
                                    // If unable to create movie genre relationship, return error
                                    .catch(function(err) {
                                        return res.status(500).json({ 'error': 'Unable to create movie genre association' });
                                    });
                                })
                                // If unable to create genre, return error
                                .catch(function(err) {
                                    return res.status(500).json({ 'error': 'Unable to create genre' });
                                });
                            } else {
                                // Create movie genre relationship in movie_genre table
                                models.movie_has_genres.create({
                                    movies_id: newMovie.id,
                                    genres_id: genreFound.id
                                })
                                // Return movie, and movie genre relationship
                                .then(function(movie_genres) {
                                    return res.status(201).json(newMovie, movie_genres);
                                })
                                // If unable to create movie genre relationship, return error
                                .catch(function(err) {
                                    return res.status(500).json({ 'error': 'Unable to create movie genre association' });
                                });
                            }
                        })
                    })    
                    // If unable to check if genre exists, return error
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Unable to look up genre' });
                    })
                })
            } else {
                // If movie exists, return error
                return res.status(404).json({ 'error': 'Movie already exists' });
            }
        })
        // If unable to check if movie exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify if movie exists' });
        });
    }
};