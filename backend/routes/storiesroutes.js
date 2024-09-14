const express= require("express");
const { createStoryController, fetchStoryFollowersController, fetchStoriesController } = require("../controllers/storiescontroller");
const {protect}=require("../middleware/authorizationmiddleware");
const {upload,compressImage}=require("../middleware/multermiddleware");

const router= express.Router();

router.post("/create",protect,upload.single("story"),compressImage,createStoryController);
router.get("/fetchstorycreator",protect,fetchStoryFollowersController);
router.get("/fetchstory/:userId",protect,fetchStoriesController);
module.exports= router;