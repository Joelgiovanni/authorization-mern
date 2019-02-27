const express = require('express');
const mongoose = require('mongoose');

//Middleware import
const bodyParser = require('body-parser');

const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));

//Setting up the Database
const db = require('./config/keys').URI;

//Connecting to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Your database is now connected'))
  .catch(err => console.log('There seemed to be a error', err));

//Setting up the Port and getting it ready for Heroku as well
//Process.env.PORT is for Heroku
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`The server is running on port ${port}`));