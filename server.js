//WE ARE RUNNING THE SERVER ON PORT 4000 & REACT ON PORT 3000

const express = require('express');
const mongoose = require('mongoose');

//Middleware import
const bodyParser = require('body-parser');

const passport = require('passport');

const users = require('./routes/api/users');

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

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

//Routes
app.use('/api/users', users);

//Setting up the Port and getting it ready for Heroku as well
//Process.env.PORT is for Heroku
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`The server is running on port ${port}`));
