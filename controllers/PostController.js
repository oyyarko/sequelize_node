require("dotenv").config();
const db = require("../models");

module.exports.ListAllPosts = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const { id: loggedIn } = req.user;
    const followingIds = await db.Users.findByPk(loggedIn, {
      attributes: ["user_id"],
      include: [
        {
          model: db.Followers,
          as: "followings",
          attributes: ["following_id"],
        },
      ],
    });

    const fetchPosts = followingIds.followings.map(
      (following) => following.following_id
    );

    const posts = await db.Posts.findAndCountAll({
      where: { posted_by: fetchPosts },
      limit,
      offset,
    });
    
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

module.exports.UpdatePost = async (req, res, next) => {
  const { post_id } = req.params;
  const { title, content, posted_by } = req.body;
  try {
    const user = await db.Users.findByPk(posted_by);
    if (!posted_by) {
      return res.status(400).json({ error: "Please provide User" });
    } else if (!user) {
      return res.status(400).json({ error: "User not found" });
    } else if (!post_id) {
      return res.status(400).json({ error: "Please provide Post" });
    }

    const post = await db.Posts.findByPk(post_id);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    } else if (post.posted_by !== posted_by) {
      return res
        .status(400)
        .json({ error: "Unauthorised! Can not update Post" });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    res.status(201).json({
      message: "Post updated successfully!",
      success: true,
      data: post,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.DeletePost = async (req, res, next) => {
  const { post_id } = req.params;
  try {
    const post = await db.Posts.findByPk(post_id);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    await post.destroy();

    res.status(200).json({
      message: "Post deleted successfully!",
      success: true,
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
    res.status(200).json({
      message: `Post by ${user.username} user fetched successfully!`,
      success: true,
      data: user.posts,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
