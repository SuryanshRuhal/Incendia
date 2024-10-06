const express= require("express");
const { searchFollowerController, accessChatController, fetchChatController } = require("../controllers/chatcontroller");
const { protect } = require("../middleware/authorizationmiddleware");

const router= express.Router();

router.post("/searchfollowing",protect,searchFollowerController);
router.get("/access/:chatuserid", protect, accessChatController);
router.get("/fetchchats", protect, fetchChatController);
module.exports=router;