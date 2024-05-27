require("dotenv").config();
const db = require("../models");

module.exports.CreateCommentOnPost = async (req, res, next) => {
  const { user_id, post_id, comment } = req.body;
  try {
    const user = await db.Users.findByPk(user_id);
    const post = await db.Posts.findByPk(post_id);

    if (!user || !post) {
      return res.status(400).json({ error: "User or Post not found" });
    }
    const newComment = await db.Comments.create({ user_id, post_id, comment });

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
      include: {
        model: db.Comments,
        as: "comments",
        include: {
          model: db.Users,
          as: "user",
          attributes: ["username"],
        },
      },
    });
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    res.status(200).json({
      message: "Comments fetched successfully!",
      success: true,
      data: post.comments,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

// module.exports.CommentOnParentComment = async (req, res, next) => {
//   const { comment_id, user_id, comment } = req.body;
//   try {
//     next();
//   } catch (err) {
//     res.status(500).json({ message: err, success: false, data: [] });
//   }
// };
