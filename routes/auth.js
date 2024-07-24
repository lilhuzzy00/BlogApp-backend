const express = require("express");
const router = express.Router();

const {register, login, currentUser, forgotPassword} = require("../controllers/auth");
const { requireSignin } = require("../middlewares");


router.post("/register", register)
router.post("/login", login)
router.get("/current-user", requireSignin, currentUser)
router.post("/forgot-password", forgotPassword)


module.exports = router;
