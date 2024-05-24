require("dotenv").config();
const db = require("../models");

module.exports.ListAllPosts = async (req, res, next) => {
  try {
    const posts = await db.Posts.findAll();
    res.status(201).json({
      message: "Post fetched successfully!",
      success: true,
      data: posts,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.CreatePost = async (req, res, next) => {
  const { posted_by, title, content } = req.body;
  try {
    const user = await db.Users.findByPk(posted_by);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const newPost = await db.Posts.create({ posted_by, title, content });
    res.status(201).json({
      message: "Post created successfully!",
      success: true,
      data: newPost,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.GetPostByUserId = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const user = await db.Users.findByPk(user_id, {
      include: {
        model: db.Posts,
        as: "posts",
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(201).json({
      message: `Post by ${user.username} user fetched successfully!`,
      success: true,
      data: user.posts,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
