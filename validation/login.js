const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  //Email (or Username ?) checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'You must enter your email';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'You must enter a valid email';
  }

  //Password
  if (Validator.isEmpty(data.password)) {
    errors.password = 'You must enter a password';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
