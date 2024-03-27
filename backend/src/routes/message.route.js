const Router = require("express");
const {sendMessage, allMessages} = require("../controllers/message.controller.js");
const verifyJWT  = require("../middlewares/auth.middleware.js");

const router = Router()

router.route("/").post(verifyJWT, sendMessage);
router.route("/:chatId").get(verifyJWT, allMessages);

module.exports = router;