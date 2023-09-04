const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please Provide a name !!"],
    maxlength: [40, "Name Should Be Under 40 Characters !!"],
  },

  email: {
    type: String,
    require: [true, "Please Provide Email !!"],
    validate: [validator.isEmail, "Please Enter Email in Correct Format !!"],
    unique: true,
  },

  password: {
    type: String,
    require: [true, "Please Provide Password !!"],
    minlength: [8, "Password Should Be at Least 8 characters"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
  },

  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },

  forgotPasswordToken: {
    type: String,
  },

  forgotPasswordExpiry: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password before save -HOOK ..
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//validate the password
userSchema.methods.isValidPassword = async function (useSendPassword) {
  return await bcrypt.compare(useSendPassword, this.password);
};

//create and return jwt token
userSchema.methods.getJwtToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//generate , save to db and return forgotPassword Token
userSchema.methods.getForgotPasswordToken = async function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = forgotToken;
  this.forgotPasswordExpiry = Date.now() + 5 * 60 * 1000;
  return forgotToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
