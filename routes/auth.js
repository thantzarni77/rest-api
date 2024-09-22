const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");
const authMiddleware = require("../middleware/isAuth");

//post register
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already existed");
          }
        });
      }),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must have at least 4 words")
      .isLength({ max: 10 })
      .withMessage("Username should not be more than 10 words")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Username already existed");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 letters"),
  ],
  authController.register
);

//post /login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please Enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 letters"),
  ],
  authController.login
);

//middleware
router.get("/status", authController.checkStatus);

module.exports = router;
