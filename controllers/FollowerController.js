require("dotenv").config();
const db = require("../models");

module.exports.FollowOrUnfollowUser = async (req, res, next) => {
  const { follower_id, following_id } = req.body;
  try {
    if (follower_id === following_id) {
      return res.status(400).json({ error: "You cannot follow youself" });
    } else if (!follower_id || !following_id) {
      return res.status(400).json({ error: "Please provide User" });
    }

    const currUser = await db.Users.findByPk(follower_id);
    const followingUser = await db.Users.findByPk(following_id);

    if (!currUser || !followingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const existingFollow = await db.Followers.findOne({
      where: {
        follower_id: follower_id,
        following_id: following_id,
      },
    });

    if (!existingFollow) {
      // not following
      const followUser = await db.Followers.create({
        follower_id,
        following_id,
      });
      res.status(201).json({
        // response
        message: "Followed successfully!",
        success: true,
        data: followUser,
      });
    } else {
      // already following
      if (
        existingFollow.follower_id !== follower_id ||
        existingFollow.following_id !== following_id
      ) {
        return res
          .status(400)
          .json({ error: "Unauthorised! Can not follow this User" });
      } else {
        await existingFollow.destroy();
        res.status(200).json({
          message: "Unfollowed successfully!",
          success: true,
        });
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.ListUserFollowingOrFollowers = async (req, res, next) => {
  const { user_id } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({ error: "Please provide User" });
    }

    const followings = await db.Users.findByPk(user_id, {
      include: [
        {
          model: db.Followers,
          as: "followers",
          attributes: ["follower_id"],
        },
        {
          model: db.Followers,
          as: "followings",
          attributes: ["following_id"],
        },
      ],
      attributes: ["username", "user_id"],
    });

    res.status(200).json({
      message: `Followers fetched successfully!`,
      success: true,
      data: followings,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
