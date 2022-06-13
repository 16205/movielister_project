// Imports
var bcrypt      = require('bcrypt');
var jwtUtils    = require('../utils/jwt.utils');
var models      = require('../models');

// Constants
const PASSWORD_REGEX = /^(?=.*\d).{6,12}$/;

// Routes
module.exports = {
    register: function(req, res) {

        // Get new user params from request
        var username    = req.body.username;
        var password    = req.body.password;
        var firstname   = req.body.firstname;
        var lastname    = req.body.lastname;

        // Check for empty user params
        if (username == null || password == null || firstname == null || firstname.length == 0 || lastname == null || lastname.length == 0) {
            return res.status(400).json({ 'error': 'Missing parameters' });
        }

        // Check username length
        if (username.length >= 20 || username.length <= 4) {
            return res.status(400).json({ 'error': 'Username must be between 4 and 20 characters' });
        }

        // Check password validity
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'Password must be between 4 and 8 characters and contain at least one number' });
        }

        // Check if user already exists
        models.user.findOne({
            attributes: ['username'],
            where: { username: username }
        })
        .then(function(userFound) {
            // If user doesn't exist, create it'
            if (!userFound) {
                bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                    var newUser = models.user.create({
                        username: username,
                        password: bcryptedPassword,
                        firstname: firstname,
                        lastname: lastname,
                        admin: '0'
                    })
                    // Return created user in response
                    .then(function(newUser) {
                        return res.status(201).json({
                            'userId': newUser.id, 
                        });
                    })
                    // Catch errors
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Error registering user' });
                    });
                })
            // If user exist, return error
            } else {
                return res.status(409).json({ 'error': 'User already exists' });
            }
        })
        // If unable to check if user exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify user' });
        })
    },

    login: function(req, res) {

        // Get user params from request
        var username    = req.body.username;
        var password    = req.body.password;

        // Check for empty user params
        if (username == null || username.length == 0 || password == null || password.length == 0) {
            return res.status(400).json({ 'error': 'Missing parameters' });
        }

        // Check if user exists
        models.user.findOne({
            where: { username: username }
        })
        .then(function(userFound) {
            if (userFound) {
                // Check if password is correct
                bcrypt.compare(password, userFound.password, function(errBcrypt, resBcrypt) {
                    if (resBcrypt) {
                        // If password is correct, return generated JWT token in response
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateToken(userFound)
                        });
                    } else {
                        // If password is incorrect, return error
                        return res.status(403).json({ 'error': 'Wrong password' });
                    }
                });
            } else {
                return res.status(404).json({ 'error': 'User not found' });
            }
        })
        // If unable to check if user exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify user' });
        })
    },

    getUserProfile: function(req, res) {
        // Get auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        // Check if id given in query params, to get other user profile
        if (req.query.id) {
            userId = req.query.id;
        }

        // Check if userId has been verified
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Find user in database with id from token
        models.user.findOne({
            attributes: ['id', 'username', 'firstname', 'lastname'],
            where: { id: userId },
            include: { 
                model: models.movie,
                attributes: ['title', 'description', 'director', 'year', 'createdAt', 'updatedAt'],
                include: {
                    model: models.genre,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }
            }
        })
        // Return user in response
        .then(function(user) {
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ 'error': 'User not found' });
            }
        })
        // If unable to check if user exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to fetch user' });
        })
    },

    updateUserProfile: function(req, res) {
        // Get auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        // Params
        var username    = req.body.username;
        var password    = req.body.password;
        var firstname   = req.body.firstname;
        var lastname    = req.body.lastname;

        // Check if userId has been verified
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Check username length
        if (username.length >= 20 || username.length <= 4) {
            return res.status(400).json({ 'error': 'Username must be between 4 and 20 characters' });
        }

        // Check password validity
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'Password must be between 4 and 8 characters and contain at least one number' });
        } else {
            bcrypt.hash(password, 5, bcryptedPassword => {
                password = bcryptedPassword;
            });
        }

        // Find user in database with id from token
        models.user.findOne({
            attributes: ['id', 'username', 'firstname', 'lastname'],
            where: { id: userId }
        })
        // Update user in database
        .then(function(userFound) {
            if (userFound) {
                userFound.update({
                    username: (username ? username : userFound.username),
                    password: (password ? password : userFound.password),
                    firstname: (firstname ? firstname : userFound.firstname),
                    lastname: (lastname ? lastname : userFound.lastname)
                })
                // Return user in response
                .then(function(userFound) {
                    return res.status(200).json(userFound);
                })
                // Catch errors
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'Unable to update user' });
                });
                        
            } else {
                return res.status(404).json({ 'error': 'User not found' });
            }
        })
        // If unable to check if user exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify user' });
        })
    },

    // Does not work (sets movies' user_id to null, but still enters catch)
    deleteUser: function(req, res) {
        // Get auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        // Check if userId has been verified
        if (userId < 0) {
            return res.status(400).json({ 'error': 'Invalid token' });
        }

        // Find user in database with id from token
        models.user.findOne({
            where: { id: userId }
        })
        // Delete user in database
        .then(function(userFound) {
            if (userFound) {
                // Set movies' created by this user 'user_id' to null
                models.movie.findAll({
                    // attributes: ['user_id'],
                    where: { users_id: userId }
                })
                .then(function(movieFound) {
                    if (movieFound) {
                        movieFound.forEach(movie => {
                            movie.update({
                                users_id: null
                            })
                        })
                        .then(function() {
                            userFound.destroy()
                            // Return user in response
                            .then(function() {
                                return res.status(200).json({ 'message': 'User deleted successfully' });
                            })
                            // Catch errors
                            .catch(function(err) {
                                return res.status(500).json({ 'error': 'Unable to delete user' });
                            });
                        })
                        .catch(function(err) {
                            return res.status(500).json({ 'error': 'Unable to update movie' });
                        });
                    }
                })  
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'Unable to fetch movies' });
                });
            } else {
                return res.status(404).json({ 'error': 'User not found' });
            }
        })
        // If unable to check if user exists, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify user' });
        })
    },

    getAllUsers: function(req, res) {
        models.user.findAll({
            attributes: ['id', 'username'],
        })
        // Return user in response
        .then(function(usersFound) {
            if (usersFound) {
                return res.status(200).json(usersFound);
            } else {
                return res.status(404).json({ 'message': 'No users found' });
            }
        })
        // If unable to check users, return error
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to fetch users' });
        })
    }
}