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
  const { errors, isValid } = validateRegisterInput(req.body);

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

// @route POST api/users/login
// @desc Login the user and return JWT token
// @access Public
router.post('/login', (req, res) => {
  //Form Validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Checking the Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find the User by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res
        .status(404)
        .json({ emailNotFound: 'That Email was not found' });
    }

    //Check the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };

        //Sign the token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600 // 1 hour in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer' + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordIncorrect: 'That password is not correct' });
      }
    });
  });
});

//Exporting to be able to use in other files
module.exports = router;
