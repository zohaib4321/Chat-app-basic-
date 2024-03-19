const {Router} = require("express")
const {registerUser, loginUser, getAllUsers, logoutUser} = require("../controllers/user.controller.js");
const verifyJWT = require("../middlewares/auth.middleware.js")
const router = Router()

router.route("/").post(registerUser)
router.route("/login").post(loginUser)

// secured routes
router.route("/").get(verifyJWT, getAllUsers);
// router.route("/logout").post(verifyJWT, logoutUser)

module.exports = router

