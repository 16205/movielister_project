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
    getAllMovies: function(req, res) {
        // Params
        var order = req.query.order
        
        // Get all movies, alphabetically ordered by title (by default)
        models.movie.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: ['title', 'director', 'year'],
            // Get genres for every movie
            include: [{
                model: models.genre,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }]
        })
        .then(function(movies) {
            if (movies) {
                return res.status(200).json(movies);
            } else {
                return res.status(404).json({ 'message': 'No movies found' })
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to fetch movies' });
        });
    },

    getMovie: function(req, res) {
        // Params
        var id = req.query.id;
        var title = req.query.title;
        
        // Get movie by id
        if (id != null) {
            models.movie.findOne({
                attributes: ['title', 'description', 'director', 'year'],
                where: {
                    id: req.query.id
                },
                include: [{
                    // Get genres for this movie
                    model: models.genre,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                },{
                    // Get user who added this movie
                    model: models.user,
                    attributes: ['username']
                }]
            })
            .then(function(movie) {
                if (movie) {
                    return res.status(200).json(movie);
                } else {
                    return res.status(404).json({ 'error': 'Movie not found' })
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Unable to fetch movie' });
            });

        // Search movie by title    
        } else if (title != null) {
            models.movie.findOne({
                attributes: ['title', 'description', 'director', 'year'],
                where: {
                    title: req.query.title
                },
                include: [{
                    // Get genres for this movie
                    model: models.genre,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                },{
                    // Get user who added this movie
                    model: models.user,
                    attributes: ['username']
                }]
            })
            .then(function(movie) {
                if (movie) {
                    return res.status(200).json(movie);
                } else {
                    return res.status(404).json({ 'error': 'Movie not found' })
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Unable to fetch movie' });
            });
        }
    },

    createMovie: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var title       = req.body.title;
        var description = req.body.description;
        var director    = req.body.director;
        var year        = req.body.year;
        var genres      = req.body.genres; 

        // Check if token is valid
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Check for empty params
        if (title == null || director == null || year == null) {
            return res.status(400).json({ 'error': 'Missing parameters' });
        }

        // Check for title length
        if (!(TITLE_LIMIT > title.length > 0)) {
            return res.status(400).json({ 'error': 'Title must be less than ' + TITLE_LIMIT + ' characters' });
        }

        // Check for description length
        if (!(DESCRIPTION_LIMIT > description.length > 0)) {
            return res.status(400).json({ 'error': 'Description must be less than ' + DESCRIPTION_LIMIT + ' characters' });
        }
        
        // Check for director length
        if (!(DIRECTOR_LIMIT > director.length > 0)) {
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
                    // if genre given
                    if (genres != null) {
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
                                    // Create movie genre relationship in movie_has_genres table, from movie and newly created genre
                                    .then(function(newGenre) {
                                        models.movie_has_genres.create({
                                            movieId: newMovie.id,
                                            genreId: newGenre.id
                                        })
                                    })
                                    // If unable to create genre, return error and delete created movie and genre associations
                                    .catch(function(err) {
                                        models.movie_has_genres.destroy({
                                            where: { movieId: newMovie.id }
                                        })
                                        models.movie.destroy({
                                            where: { id: newMovie.id }
                                        })
                                        return res.status(500).json({ 'error': 'Unable to create genre' });
                                    });
                                } else {
                                    // Create movie genre relationship in movie_genre table
                                    models.movie_has_genres.create({
                                        movieId: newMovie.id,
                                        genreId: genreFound.id
                                    })
                                }
                            })
                            // If unable to look for genre, return error and delete created movie and genre associations
                            .catch(function(err) {
                                models.movie_has_genres.destroy({
                                    where: { movieId: newMovie.id }
                                })
                                models.movie.destroy({
                                    where: { id: newMovie.id }
                                })
                                return res.status(500).json({ 'error': 'Unable to look up genres' });
                            });
                        })
                    }
                    // Return new movie
                    return res.status(201).json(newMovie);
                })
                // If unable to create movie, return error
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'Unable to create movie' });
                })
            } else {
                // If movie exists, return error
                return res.status(409).json({ 'error': 'Movie already exists' });
            }
        })
        // If unable to check if movie exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify if movie exists' });
        });
    },

    updateMovie: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var id          = req.body.id;
        var title       = req.body.title;
        var description = req.body.description;
        var director    = req.body.director;
        var year        = req.body.year;
        var genres      = req.body.genres; 

        // Check if token is valid
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Check for title length
        if (title != null && !(TITLE_LIMIT > title.length > 0)) {
            return res.status(400).json({ 'error': 'Title must be less than ' + TITLE_LIMIT + ' characters' });
        }

        // Check for description length
        if (description != null && !(DESCRIPTION_LIMIT > description.length > 0)) {
            return res.status(400).json({ 'error': 'Description must be less than ' + DESCRIPTION_LIMIT + ' characters' });
        }
        
        // Check for director length
        if (director != null && !(DIRECTOR_LIMIT > director.length > 0)) {
            return res.status(400).json({ 'error': 'Director must be less than ' + DIRECTOR_LIMIT + ' characters' });
        }

        // Check year format
        if (year != null && !YEAR_REGEX.test(year)) {
            return res.status(400).json({ 'error': 'Year must be a 4 digits number between 1900 and 2099' });
        }

        // Find movie to be updated
        models.movie.findOne({
            where: { id: id }
        })
        .then(function(movieFound) {
            // If movie exists, update it, with userId
            if (movieFound) {
                // Check if movie belongs to user
                if (movieFound.users_id == userId) {
                    // Update movie
                    movieFound.update({
                        title: (title ? title : movieFound.title),
                        description: (description ? description : movieFound.description),
                        director: (director ? director : movieFound.director),
                        year: (year ? year : movieFound.year)
                    })
                    // Add movie genre relationship
                    .then(function(updatedMovie) {
                        // Delete old genre relationships
                        models.movie_has_genres.destroy({
                            where: { movieId: updatedMovie.id }
                        })
                        // If genre given
                        if (genres != null) {
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
                                        // Create movie genre relationship in movie_has_genres table, from movie and newly created genre
                                        .then(function(newGenre) {
                                            models.movie_has_genres.create({
                                                movieId: updatedMovie.id,
                                                genreId: newGenre.id
                                            })
                                        })
                                        // If unable to create genre, return error and delete created movie and genre associations
                                        .catch(function(err) {
                                            return res.status(500).json({ 'error': 'Unable to create genre' });
                                        });
                                    } else {
                                        // Create movie genre relationship in movie_genre table
                                        models.movie_has_genres.create({
                                            movieId: updatedMovie.id,
                                            genreId: genreFound.id
                                        })
                                    }
                                })
                                // If unable to look for genre, return error and delete created movie and genre associations
                                .catch(function(err) {
                                    return res.status(500).json({ 'error': 'Unable to look up genres' });
                                });
                            })
                        }
                        // Return updated movie, and updated movie genre relationship, after creating relationships with all given genres
                        return res.status(200).json(updatedMovie);
                    })
                    // If unable to update movie, return error
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Unable to update movie' });
                    })
                } else {
                    // If movie doesn't belong to user, return error
                    return res.status(403).json({ 'error': 'Movie doesn\'t belong to user' });
                }
            } else {
            // If movie doesn't exist, return error
                return res.status(404).json({ 'error': 'Movie doesn\'t exist' });
            }
        })
        // If unable to look for movie, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to look for movie' });
        });
    },

    deleteMovie: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Check if userId has been verified
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Find movie to be deleted
        models.movie.findOne({
            where: { id: req.query.id }
        })
        .then(function(movieFound) {
            // If movie exists, delete it, with userId
            if (movieFound) {
                // Check if movie belongs to user
                if (movieFound.users_id == userId) {
                    // First, delete movie's genre associations
                    models.movie_has_genres.destroy({
                        where: { movieId: movieFound.id }
                    })
                    // Then, delete movie
                    .then(function() {
                        // Delete movie
                        movieFound.destroy()
                        // Return success message
                        .then(function(deletedMovie) {
                            return res.status(200).json({ 'message': 'Movie deleted' });
                        })
                        // If unable to delete movie, return error
                        .catch(function(err) {
                            return res.status(500).json({ 'error': 'Unable to delete movie' });
                        })
                    })
                    // If unable to delete movie genre associations, return error
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Unable to delete movie genre associations' });
                    })
                } else {
                    // If movie doesn't belong to user, return error
                    return res.status(403).json({ 'error': 'Movie doesn\'t belong to user' });
                }
            } else {
            // If movie doesn't exist, return error
                return res.status(404).json({ 'error': 'Movie doesn\'t exist' });
            }
        })
        // If unable to look for movie, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to look for movie' });
        });
    }
};