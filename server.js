// Imports
const express = require('express')
const bodyParser = require('body-parser');

// Server instantiation
const app = express()

// Body  parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());   
 
// Routes


// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});