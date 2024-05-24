require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../models");

module.exports.AuthenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    } else {
    //   const user = await db.Users.findByPk(data.user_id);
      req.user = data;
      next();
    //   if (user) {
    //     return res.json({ status: true, user: user.username });
    //   } else {
    //     return res.json({ status: false });
    //   }
    }
  });
};
