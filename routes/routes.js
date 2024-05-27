const {
  ListUsers,
  SignUp,
  Login,
  UpdateUser,
} = require("../controllers/UserController");
const {
  CreatePost,
  GetPostByUserId,
  ListAllPosts,
  UpdatePost,
  DeletePost,
} = require("../controllers/PostController");
const {
  CreateCommentOnPost,
  GetAllCommentsForPost,
} = require("../controllers/CommentController");
const { AuthenticateUser } = require("../middleware/AuthMiddleware");
const upload = require("../utils/Upload");
const { LikeOrUnlikePost, ListLikesOfPost } = require("../controllers/LikeController");

const router = require("express").Router();

//user
router.post("/login", Login);
router.post("/signup", SignUp);
router.get("/listUsers", AuthenticateUser, ListUsers);
router.patch(
  "/updateUser/:user_id",
  upload.single("file"),
  AuthenticateUser,
  UpdateUser
);

//post
router.get("/listPosts", AuthenticateUser, ListAllPosts);
router.post("/createPost", AuthenticateUser, CreatePost);
router.delete("/deletePost/:post_id", AuthenticateUser, DeletePost);
router.patch("/updatePost/:post_id", AuthenticateUser, UpdatePost);
router.post(
  "/getPostByUserId/:user_id/posts",
  AuthenticateUser,
  GetPostByUserId
);

//comments
router.post("/createCommentOnPost", AuthenticateUser, CreateCommentOnPost);
router.get(
  "/getCommentsForPosts/:post_id/comments",
  AuthenticateUser,
  GetAllCommentsForPost
);

//likes

router.post("/likeOrUnlikePost", AuthenticateUser, LikeOrUnlikePost);
router.get("/listLikesOfPost/:post_id", AuthenticateUser, ListLikesOfPost);


module.exports = router;
