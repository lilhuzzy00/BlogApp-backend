const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

const {createPost, uploadImage, postByUser, userPost, updatePost, deletePost} = require("../controllers/post");
const { requireSignin, userCanEditPost } = require("../middlewares");


router.post("/create-post", requireSignin, createPost);
router.post("/upload-image", requireSignin, formidable({maxFileSize: 5 *1024 * 1024}), uploadImage);
router.get('/post-by-users', requireSignin, postByUser);
router.get("/user-post/:_id", requireSignin, userPost);
router.put("/update-post/:_id", requireSignin, userCanEditPost, updatePost);
router.delete("/delete-post/:_id", requireSignin, userCanEditPost, deletePost);


module.exports = router;
