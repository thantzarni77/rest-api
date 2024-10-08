const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.register = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorMessage: errors.array(),
    });
  }

  const { email, password, username } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPwd) => {
      return User.create({
        email,
        password: hashedPwd,
        username,
      });
    })
    .then((result) => {
      res.status(201).json({
        message: "User Created",
        userID: result._id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("Something went wrong");
    });
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation Failed",
        errorMessage: errors.array(),
      });
    }

    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return res.status(401).json({
        message: "Email doesn't exist",
      });
    }

    const isMatch = bcrypt.compareSync(password, userDoc.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong user credentials",
      });
    }

    const token = jwt.sign(
      { email: userDoc.email, userID: userDoc._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ token, userID: userDoc._id, userEmail: userDoc.email });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.checkStatus = (req, res, next) => {
  const authHeader = req.get("Authorizaton");
  if (!authHeader) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const tokenMatch = jwt.verify(token, process.env.JWT_KEY);
    if (!tokenMatch) {
      return res.status(401).json({
        message: "User Not Authenticated",
      });
    }
    req.userID = tokenMatch.userID;
    res.json("OK");
    next();
  } catch (err) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }
};
