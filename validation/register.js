//NPM validator
const Validator = require('validator');
const isEmpty = require('is-empty');

//The 'Will be done later when the front end comes into play.
module.exports = function validateRegisterInput(data) {
  let errors = {};

  //Convert empty fields into a empty string so that we can use Validator functions
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  //Using VALIDATOR
  //Start filling up that empty errors object with whatever errors come up

  //Checking Name
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  //Checking Email
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'That is not a valid email';
  }

  //Checking Passwords to make sure they are valid and that they match
  if (Validator.isEmpty(data.password)) {
    errors.password = 'You must fill out a password';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'You must confirm the password';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = 'The password must be at least 6 characters';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'The passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
