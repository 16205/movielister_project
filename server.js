const express = require('express')
const db = require('./config/database')
const app = express()

// Connect to database
db.authenticate()
    .then(() => {
        console.log('Connection to database has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })
    
    app.route('/').get((req, res) => {
        res.send('Hello World!')
    })



// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});