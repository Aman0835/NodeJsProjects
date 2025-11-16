const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: [2, "first name must be at least 2 characters"],
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
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("invalid gender");
        }
      },
    },
    about:{
      type:String,
      maxlength:[250,"about section must be less than 250 characters"],
      trim:true,
    }
  },
  {
    timestamps: true
  }
);


userSchema.index({firstName:1,lastName:1});

userSchema.methods.getJWT = async function () {
  const user = this;

   const token = await jwt.sign({_id: user._id},"secretkey",{expiresIn:"7d"});
    return token;
};


userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const hashedPassword = user.password;
  return await bcrypt.compare(passwordByUser, hashedPassword);
};



const User = mongoose.model("user", userSchema);

module.exports = User;
