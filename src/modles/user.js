const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: [2,"first name must be at least 2 characters"],
    maxlength: [10],
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: [2],
    maxlength: [10],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    toLowerCase: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        validator.isStrongPassword(v);
      },
    },
  },
  gender: {
    type: String,
    validate(value) {
        if(!["male","female","other"].includes(value)){
            throw new Error("invalid gender");
        }
    },
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
