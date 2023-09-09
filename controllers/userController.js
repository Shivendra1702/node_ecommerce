const User = require("../models/user");
const mailHelper = require("../utils/email");
const cloudinary = require("cloudinary").v2;

const signUp = async function (req, res, next) {
  try {
    if (!req.files) {
      return next(new Error(`Photo Required !`));
    }

    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: `Please Enter All The Fields !`,
      });
    }

    let file = req.files.photo;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    const user = await User.create({
      name,
      email,
      password,
      photo: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    });

    const token = user.getJwtToken();

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in sign in : ${error}`,
    });
  }
};

const signIn = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter all The Fields !!" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Registered !" });
    }

    if (!(await user.isValidPassword(password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password !" });
    }

    const token = user.getJwtToken();

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    user.password = undefined;

    res.status(200).cookie("token", token, options).json({
      sucess: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in sign in : ${error}`,
    });
  }
};

const logOut = async function (req, res, next) {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out Successfully !",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in Log Out : ${error}`,
    });
  }
};

const forgotPassword = async function (req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: `Please Enter Email !`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "User Not Registered !" });
    }

    const forgotToken = user.getForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;

    const message = `Forgot Password ? Reset Password Using This Link : ${myUrl}`;

    try {
      await mailHelper({
        email: email,
        subject: "Apna Store : Password Reset Email",
        message: message,
      });

      res.status(200).json({
        success: true,
        message: `Email Sent Successfully !`,
      });
    } catch (error) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: `Error in Sending Email : ${error}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in Forgot Password : ${error}`,
    });
  }
};

const passwordReset = async function (req, res, next) {
  try {
    const forgotToken = req.params.token;

    const user = await User.findOne({
      forgotPasswordToken: forgotToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Invalid Token !`,
      });
    }

    if (req.body.password !== req.body.confirmpassword) {
      return res.status(400).json({
        success: false,
        message: `Password and Confirm Password Do Not Match !`,
      });
    }

    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    const token = user.getJwtToken();

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in Password Reset : ${error}`,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  logOut,
  forgotPassword,
  passwordReset,
};
