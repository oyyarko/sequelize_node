require("dotenv").config();
const bcrypt = require("bcryptjs");

const db = require("../models");
const { createSecretToken } = require("../utils/SecretToken");

module.exports.SignUp = async (req, res, next) => {
  const { username, bio, profilePicture, password } = req.body;

  try {
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!username || !usernameRegex.test(username)) {
      return res.status(400).json({ error: "Please provide valid username" });
    }
    if(!password) {
      return res.status(400).json({ error: "Please provide password" });
    }
    const existingUser = await db.Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username is taken!" });
    }

    const newUser = await db.Users.create({
      username,
      bio,
      profilePicture,
      password,
    });

    const token = createSecretToken(newUser.user_id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({
      message: "User created successfully!",
      success: true,
      data: newUser,
      token: token,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.Login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.status(400).json({ error: "Please provide valid username" });
    }
    const user = await db.Users.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = createSecretToken(user.user_id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(200).json({
      message: "Logged in successfully!",
      success: true,
      data: user,
      token: token,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.ListUsers = async (req, res, next) => {
  try {
    const users = await db.Users.findAll();
    res
      .status(200)
      .json({ message: "Fetched successfully!", success: true, data: users });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
