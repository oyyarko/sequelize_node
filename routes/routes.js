const { ListUsers } = require("../controllers/UserController");

const router = require("express").Router();

router.get("/listUsers", ListUsers);

module.exports = router;
