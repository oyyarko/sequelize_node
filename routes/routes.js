const { CreateCommentOnPost, GetAllCommentsForPost } = require("../controllers/CommentController");
const { CreatePost, GetPostByUserId } = require("../controllers/PostController");
const { ListUsers } = require("../controllers/UserController");

const router = require("express").Router();

//user
router.get("/listUsers", ListUsers);

//post
router.post("/createPost", CreatePost);
router.post("/getPostByUserId/:user_id/posts", GetPostByUserId)

//comments
router.post("/createCommentOnPost", CreateCommentOnPost);
router.get("/getCommentsForPosts/:post_id/comments", GetAllCommentsForPost)

module.exports = router;
