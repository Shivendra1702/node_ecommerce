const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  logOut,
  forgotPassword,
  passwordReset,
  getUserDetails,
  changePassword,
  updateUserDetails,

  adminAllUsers,
  adminGetSingleuser,
  adminUpdateUser,
  adminDeleteUser,

  managerAllUsers,
} = require("../controllers/userController");

const { isLoggedIn, customRole } = require("../middlewares/user");

// isLoggedIn middleware is used to check if the user is logged in or not

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/logout").get(logOut);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);

router
  .route("/admin/users")
  .get(isLoggedIn, customRole("admin"), adminAllUsers);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleuser)
  .put(isLoggedIn, customRole("admin"), adminUpdateUser)
  .delete(isLoggedIn, customRole("admin"), adminDeleteUser);

router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerAllUsers);

module.exports = router;
