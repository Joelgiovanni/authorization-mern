const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//Load in the input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load the user model
const User = require('../../models/User');

//Routes

// @route POST api/users/register
// @desc Register a user
// @access Public
router.post('/register', (req, res) => {
  //Form validation
  const { errors, isValid } = validateRegisterInput(req, body);

  //Check the validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res
        .status(400)
        .json({ email: 'That email is already registered' });
    }
  });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  //Hash the password saving inside of database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    });
  });
});
