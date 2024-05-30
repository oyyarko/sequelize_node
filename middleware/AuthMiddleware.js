require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.AuthenticateUser = (req, res, next) => {
  // console.log('req :>> ', req.headers.token);
  const token = req.cookies.token || req.headers.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    } else {
      req.user = data;
      next();
    }
  });
};

