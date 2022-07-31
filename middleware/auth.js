const jwt = require("jsonwebtoken");
const configurations = require("../config/config.js");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-authentication-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, configurations.jwt.key);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
