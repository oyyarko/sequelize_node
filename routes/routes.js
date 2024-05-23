const { CreatePost, GetPostByUserId } = require("../controllers/PostController");
const { ListUsers } = require("../controllers/UserController");

const router = require("express").Router();

router.get("/listUsers", ListUsers);
router.post("/createPost", CreatePost);
router.post("/getPostByUserId/:userId/posts", GetPostByUserId)

module.exports = router;
