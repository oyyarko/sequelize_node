require("dotenv").config();
const db = require("../models");

module.exports.ListUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll();
    res
      .status(200)
      .json({ message: "Fetched successfully!", success: true, data: users });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
