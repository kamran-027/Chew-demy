// Middleware for handling auth for Admin
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function adminMiddleware(req, res, next) {
  let token = req.headers.authorization;

  if (token) {
    token = token.replace(/^Bearer\s+/, ""); //Separting the token in header
    jwt.verify(token, process.env.JWTPass, (err, decoded) => {
      if (err) {
        return res.status(404).json({ err: "Not a valid Admin" });
      }
      next();
    });
  } else {
    res.status(404).json({ err: "Not a valid token" });
  }
}

module.exports = adminMiddleware;
