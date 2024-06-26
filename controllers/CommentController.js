require("dotenv").config();
const db = require("../models");

module.exports.CreateCommentOnPost = async (req, res, next) => {
  const { post_id, comment, parent_id } = req.body;
  try {
    const { id: loggedIn } = req.user;
    const post = await db.Posts.findByPk(post_id);

    if (!post) {
      return res.status(400).json({ error: "User or Post not found" });
    }

    if (parent_id) {
      const existingComment = await db.Comments.findByPk(parent_id);
      if (!existingComment) {
        return res.status(400).json({ error: "Parent comment not found" });
      }
    }

    const newComment = await db.Comments.create({
      user_id: loggedIn,
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

module.exports.DeleteComment = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    const { id: loggedIn } = req.user;
    const comment = await db.Comments.findByPk(comment_id);
    if (!comment) {
      return res.status(400).json({ error: "Comment not found" });
    }
    if (comment.user_id !== loggedIn) {
      return res
        .status(400)
        .json({ error: "Unauthorised! Can not delete Comment" });
    }
    await comment.destroy();

    res.status(200).json({
      message: "Comment deleted successfully!",
      success: true,
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
        itemsById[item.parent_id]?.replies?.push(itemsById[item.comment_id]);
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
