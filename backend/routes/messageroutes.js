const express= require("express");
const { sendMessageController, fetchChatMessagesController } = require("../controllers/messagecontroller");
const { protect } = require("../middleware/authorizationmiddleware");
const router= express.Router();

router.post("/newmessage/:chatId",protect,sendMessageController);
router.get("/fetchmessages/:chatId", protect, fetchChatMessagesController);
module.exports= router;