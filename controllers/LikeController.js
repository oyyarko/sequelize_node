require("dotenv").config();
const db = require("../models");

module.exports.LikeOrUnlikePost = async (req, res, next) => {
  const { like_id, post_id, user_id, is_liked } = req.body;
  try {
    const user = await db.Users.findByPk(user_id);
    const post = await db.Posts.findByPk(post_id);

    if (!user || !post) {
      // check if user or post exists or not
      return res.status(400).json({ error: "User or Post not found" });
    }
    const newLike = await db.Likes.findByPk(like_id); // check if given like_id exists or not

    if (!newLike) {
      // if doesn't exist
      if (is_liked === true) {
        // if liked
        const createdLike = await db.Likes.create({
          // create a new like entry with post_id and user_id
          post_id,
          user_id,
        });
        res.status(201).json({
          // response
          message: "Post liked successfully!",
          success: true,
          data: createdLike,
        });
      } else {
        // else the record doesn't exist
        return res.status(400).json({ error: "Like Record not found" });
      }
    } else {
      if (newLike.post_id !== post_id || newLike.user_id !== user_id) {
        // if accurate user_id or post_id is not provided
        // response
        return res
          .status(400)
          .json({ error: "Unauthorised! Can not like this Post" });
      }
      if (is_liked === false) {
        // if like record exists and user unlikes
        await newLike.destroy(); // delete record from db
        res.status(200).json({
          //resonse
          message: "Post unliked successfully!",
          success: true,
        });
      } else {
        // else user liking even if like record exists (reliking)
        res.status(201).json({
          // give same response without changing the like_id
          message: "Post liked successfully!",
          success: true,
          data: newLike,
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
