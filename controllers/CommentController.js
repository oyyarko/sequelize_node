require("dotenv").config();
const { where } = require("sequelize");
const db = require("../models");

module.exports.CreateCommentOnPost = async (req, res, next) => {
  const { user_id, post_id, comment, parent_id } = req.body;
  try {
    const user = await db.Users.findByPk(user_id);
    const post = await db.Posts.findByPk(post_id);

    if (!user || !post) {
      return res.status(400).json({ error: "User or Post not found" });
    }

    const existingComment = await db.Comments.findByPk(parent_id);
    if (!existingComment) {
      return res.status(400).json({ error: "Parent comment not found" });
    }
    
    const newComment = await db.Comments.create({
      user_id,
      post_id,
      comment,
      parent_id,
    });

    res.status(200).json({
      message: "Commented successfully!",
      success: true,
      data: newComment,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.GetAllCommentsForPost = async (req, res, next) => {
  const { post_id } = req.params;
  try {
    const post = await db.Posts.findByPk(post_id, {
      include: [
        {
          model: db.Comments,
          as: "comments",
          include: {
            model: db.Users,
            as: "user",
            attributes: ["username"],
          },
        },
      ],
    });
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    const nestedComments = post.toJSON().comments.flat();

    const itemsById = nestedComments.reduce((acc, item) => {
      acc[item.comment_id] = { ...item, replies: [] };
      return acc;
    }, {});

    nestedComments.forEach((item) => {
      if (item.parent_id) {
        itemsById[item.parent_id].replies.push(itemsById[item.comment_id]);
      }
    });

    const comments = Object.values(itemsById).filter(
      (item) => item.parent_id === null
    );

    res.status(200).json({
      message: "Comments fetched successfully!",
      success: true,
      data: comments,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
