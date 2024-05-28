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
        ...(followingUser.isPrivate ? { accepted: 0 } : { accepted: 1 }),
      });
      res.status(201).json({
        // response
        message: followingUser.isPrivate
          ? "Request sent successfully!"
          : "Followed successfully!",
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

module.exports.RemoveUser = async (req, res, next) => {
  const { user_id } = req.body;
  try {
    const { id: loggedIn } = req.user;
    if (!user_id) return res.status(400).json({ error: "Please provide User" });
    const user = await db.Users.findByPk(user_id, {
      attributes: ["username"],
    });
    if (!user) return res.status(400).json({ error: "User doesn't exists" });

    const existingFollow = await db.Followers.findOne({
      where: {
        follower_id: user_id,
        following_id: loggedIn,
        accepted: true,
      },
    });
    if (!existingFollow) {
      return res.status(400).json({ error: "This user doesn't follow you!" });
    } else {
      await existingFollow.destroy();
      res.status(200).json({
        message: "User removed successfully!",
        success: true,
        data: user,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.AcceptOrRejectFollowRequest = async (req, res, next) => {
  const { follow_id, user_id, accepted = false } = req.body;
  try {
    if (!follow_id || !user_id)
      return res
        .status(400)
        .json({ error: "Please provide user or follow request" });

    const user = await db.Users.findByPk(user_id);
    const followReq = await db.Followers.findByPk(follow_id);

    if (!followReq || !user) {
      return res
        .status(400)
        .json({ error: "User or Follow request doesn't exist" });
    } else {
      if (followReq.accepted) {
        res.status(400).json({
          message: `You already follow this User!`,
          success: true,
        });
      } else if (accepted) {
        followReq.accepted = accepted;
        res.status(200).json({
          message: `Accepted successfully!`,
          success: true,
          data: followReq,
        });
        await followReq.save();
      } else {
        await followReq.destroy();
        res.status(200).json({
          message: `Rejected successfully!`,
          success: true,
        });
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.ListPendingFollowRequests = async (req, res, next) => {
  try {
    const { id: loggedIn } = req.user;
    const requests = await db.Users.findByPk(loggedIn, {
      include: [
        {
          model: db.Followers,
          as: "followers",
          attributes: ["follower_id"],
          where: { accepted: false },
          required: false,
        },
      ],
      attributes: ["username", "user_id"],
    });
    res.status(200).json({
      message: `Pending requests fetched successfully!`,
      success: true,
      data: requests,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.ListUserFollowingOrFollowers = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    if (!user_id) return res.status(400).json({ error: "Please provide User" });

    const followings = await db.Users.findByPk(user_id, {
      include: [
        {
          model: db.Followers,
          as: "followers",
          attributes: ["follower_id"],
          where: { accepted: true },
          required: false, // to avoid when NULL data found in LEFT JOIN
        },
        {
          model: db.Followers,
          as: "followings",
          attributes: ["following_id"],
          where: { accepted: true },
          required: false,
        },
      ],
      attributes: ["username", "user_id"],
    });

    if (!followings) return res.status(400).json({ error: "User not found" });

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
