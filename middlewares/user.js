const User = require("../models/user");
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({ error: "error from isLoggedIn middleware" });
  }

  next();
};

const customRole = (...role) => {
  return (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) {
        return res
          .status(401)
          .json({ error: "You do not have permission to perform this action" });
      }
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "error from customRole middleware" });
    }
  };
};

module.exports = {
  isLoggedIn,
  customRole,
};
