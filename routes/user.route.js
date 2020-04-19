const express = require("express");
const user_controller = require("../controllers/user.controller");
const verify_token = require("./verify.token");
const router = express.Router();

router.post("/login", verify_token, user_controller.login);
router.post("/register", verify_token, user_controller.register);

module.exports = router;
