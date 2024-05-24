const { ListUsers, SignUp, Login } = require("../controllers/UserController");
const { CreatePost, GetPostByUserId, ListAllPosts } = require("../controllers/PostController");
const { CreateCommentOnPost, GetAllCommentsForPost } = require("../controllers/CommentController");
const { AuthenticateUser } = require("../middleware/AuthMiddleware");

const router = require("express").Router();

//user
router.post("/login", Login);
router.post("/signup", SignUp);
router.get("/listUsers", AuthenticateUser, ListUsers);

//post
router.get("/listPosts", ListAllPosts);
router.post("/createPost", CreatePost);
router.post("/getPostByUserId/:user_id/posts", GetPostByUserId)

//comments
router.post("/createCommentOnPost", CreateCommentOnPost);
router.get("/getCommentsForPosts/:post_id/comments", GetAllCommentsForPost)

module.exports = router;
