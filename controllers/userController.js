const User = require("../models/user");
const cloudinary = require("cloudinary").v2;

const signUp = async function (req, res, next) {
  try {
    if (!req.files) {
      return next(new Error(`Photo Required !`));
    }

    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return next(new Error(`Enter all The Fields !!`));
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
    return next(new Error(`Error in signUp :${error}`));
  }
};

module.exports = {
  signUp,
};
