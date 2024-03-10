const Router = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroupName,
    addNewParticipantToGroup,
    removeParticipantFromGroup,
} = require("../controllers/chat.controller.js");
const verifyJWT = require("../middlewares/auth.middleware.js")


const router = Router();

router.route("/").post(verifyJWT, accessChat);
router.route("/").get(verifyJWT, fetchChats);
router.route("/group").post(verifyJWT, createGroupChat);
router.route("/rename").put(verifyJWT, renameGroupName);
router.route("/groupadd").put(verifyJWT, addNewParticipantToGroup);
router.route("/groupremove").put(verifyJWT, removeParticipantFromGroup);

module.exports = router;
