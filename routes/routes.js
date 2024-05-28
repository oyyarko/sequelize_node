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
  DeleteComment,
  CreateCommentOnPost,
  GetAllCommentsForPost,
} = require("../controllers/CommentController");
const { AuthenticateUser } = require("../middleware/AuthMiddleware");
const upload = require("../utils/Upload");
const {
  LikeOrUnlikePost,
  ListLikesOfPost,
} = require("../controllers/LikeController");
const {
  FollowOrUnfollowUser,
  ListUserFollowingOrFollowers,
  ListPendingFollowRequests,
  AcceptOrRejectFollowRequest,
  RemoveUser,
} = require("../controllers/FollowerController");

const router = require("express").Router();

//user
router.post("/login", Login);
router.post("/signup", SignUp);
router.get("/listUsers", AuthenticateUser, ListUsers);
router.patch(
  "/updateUser",
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
router.delete("/deleteComment/:comment_id", AuthenticateUser, DeleteComment);
router.post("/createCommentOnPost", AuthenticateUser, CreateCommentOnPost);
router.get(
  "/getCommentsForPosts/:post_id/comments",
  AuthenticateUser,
  GetAllCommentsForPost
);

//followers
router.post("/removeUser", AuthenticateUser, RemoveUser);
router.post("/followOrUnfollowUser", AuthenticateUser, FollowOrUnfollowUser);
router.post(
  "/acceptOrRejectFollowRequest",
  AuthenticateUser,
  AcceptOrRejectFollowRequest
);
router.get(
  "/listUserFollowingOrFollowers",
  AuthenticateUser,
  ListUserFollowingOrFollowers
);
router.get(
  "/listPendingFollowRequests",
  AuthenticateUser,
  ListPendingFollowRequests
);

//likes
router.post("/likeOrUnlikePost", AuthenticateUser, LikeOrUnlikePost);
router.get("/listLikesOfPost/:post_id", AuthenticateUser, ListLikesOfPost);

module.exports = router;
