const express= require("express");
const {postcreatecontroller,fetchUserPostController,feedFetchController, likeController, fetchUserLikedPosts}= require("../controllers/postcontroller");
const {protect}=require("../middleware/authorizationmiddleware");

const router= express.Router();

router.post("/create",protect, postcreatecontroller);
router.get("/:username",protect,fetchUserPostController);
router.get("/",protect, feedFetchController);
router.get("/liked/:postId",protect, likeController);
router.get("/likedposts/:userId",protect, fetchUserLikedPosts);

module.exports= router;