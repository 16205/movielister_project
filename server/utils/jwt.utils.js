// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'FupI5gxq9KIYJ4WMXHueI8eWadlKa2QhJJhBn0jLsHnKY95txJ9sjtPMOOnDxFXy';

// Exported functions
module.exports = {
    // Generate a JWT token
    generateToken: function(userData) {
        return jwt.sign({
            id: userData.id,
            admin: userData.admin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        });
    },

    // Parse authorization from request header
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    // Get user ID from JWT token
    getUserId: function(authorization) {
        var userId = -1
        var token = module.exports.parseAuthorization(authorization);

        if (token != null) {
            // Verify token signature
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                // If token is valid, get user ID
                if (jwtToken != null) {
                    userId = jwtToken.id;
                }
            } catch (error) { }
        }
        return userId;
    },
};