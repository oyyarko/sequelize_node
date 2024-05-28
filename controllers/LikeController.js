require("dotenv").config();
const db = require("../models");

module.exports.LikeOrUnlikePost = async (req, res, next) => {
  const { post_id, is_liked } = req.body;
  try {
    const { id: loggedIn } = req.user;
    const post = await db.Posts.findByPk(post_id);

    if (!post) {
      // check if user or post exists or not
      return res.status(400).json({ error: "Post not found" });
    }

    const existingLike = await db.Likes.findOne({
      where: {
        user_id: loggedIn,
        post_id: post_id
      }
    });

    if(!existingLike) {
      const createdLike = await db.Likes.create({
        // create a new like entry with post_id and user_id
        post_id,
        user_id: loggedIn,
      });
      res.status(200).json({
        // response
        message: "Post liked successfully!",
        success: true,
        data: createdLike,
      });
    } else {
      if (
        existingLike.user_id !== loggedIn
      ) {
        return res
          .status(400)
          .json({ error: "Unauthorised! Can not like this Post" });
      } else {
        await existingLike.destroy();
        res.status(200).json({
          message: "Unliked successfully!",
          success: true,
        });
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.ListLikesOfPost = async (req, res, next) => {
  const { post_id } = req.params;
  try {
    const post = await db.Posts.findByPk(post_id, {
      // from Posts
      include: {
        model: db.Likes, // from Likes
        as: "likes", // as likes name
        include: {
          model: db.Users, // also include users
          as: "user",
          attributes: ["username"], //for username data
        },
      },
    });

    if (!post_id) {
      return res.status(400).json({ error: "Please provide Post" });
    } else if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    res.status(200).json({
      message: `Likes fetched successfully!`,
      success: true,
      data: post.likes,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
