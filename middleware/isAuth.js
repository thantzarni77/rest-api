const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = (req, res, next) => {
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
    next();
  } catch (err) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }
};

module.exports = isAuth;
