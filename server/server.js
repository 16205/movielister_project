// Imports
var express     = require('express');
var bodyParser  = require('body-parser');
var apiRouter   = require('./apiRouter').router;

// Server instantiation
var server = express()

// Body parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Configure routes
server.use('/api', apiRouter);


// Set port, listen for requests
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});