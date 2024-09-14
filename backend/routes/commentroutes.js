const express= require("express");
const {protect}=require("../middleware/authorizationmiddleware");
const { createCommentController, fetchFirstCommentsController, fetchReplyCommentController, likeCommentController } = require("../controllers/commentController");

const router= express.Router();

router.post("/postId/:postId/parentComment/:commentId?",protect,createCommentController);
router.get("/fetchFirstComments/:postId",protect,fetchFirstCommentsController);
router.get("/fetchReplies/:postId/parentComment/:commentId",protect,fetchReplyCommentController);
router.get("/liked/:commentId",protect, likeCommentController);

module.exports= router;