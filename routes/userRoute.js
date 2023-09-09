const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  logOut,
  forgotPassword,
  passwordReset,
} = require("../controllers/userController");

router.route("/signup").post(signUp);

router.route("/signin").post(signIn);

router.route("/logout").get(logOut);

router.route("/forgotpassword").post(forgotPassword);

router.route("/password/reset/:token").post(passwordReset);

module.exports = router;
