const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({
      status: "error",
      message: "Account does not exist",
    });
  } else {
    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Credentials",
        });
      }
      try {
        if (result) {
          let options = {
            maxAge: 20 * 60 * 1000, 
            httpOnly: true,
            secure: true,
            sameSite: "None",
          };
          const token = existingUser.generateAccessToken();
          const cookie = res.cookie("SessionID", token, options);
          console.log("cookie", cookie);
          console.log("token", token);
          res.status(200).json({
            status: "success",
            message: "You have successfully logged in.",
          });
          return res;
        }
      } catch (err) {
        console.log("err", err);
        res.status(500).json({
          status: "error",
          code: 500,
          data: [],
          message: "Internal Server Error",
          error: err.toString(),
        });
      }
      return res.status(400).json({
        status: "error",
        message: "Invalid Credentials",
      });
    });
  }
};

const registerUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  console.log(existingUser, "existingUser");

  if (existingUser) {
    return res.status(400).json({
      status: "error",
      message: "Account already exists",
    });
  } else {
    let newUser = User.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Account has been successfully created",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("SessionID");
  res.end();
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
};
