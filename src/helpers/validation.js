const validator = require("validator");

function validateSingupData(req) {
  const { firstName, lastName, email, password, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("first name and last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("invalid email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong enough");
  }
};


module.exports = { validateSingupData };