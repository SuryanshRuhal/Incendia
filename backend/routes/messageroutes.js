const express= require("express");
const { sendMessageController, fetchChatMessagesController, markChatAsReadController, fetchUnreadChatsController } = require("../controllers/messagecontroller");
const { protect } = require("../middleware/authorizationmiddleware");
const router= express.Router();

router.post("/newmessage/:chatId",protect,sendMessageController);
router.get("/fetchmessages/:chatId", protect, fetchChatMessagesController);
router.put("/markasread/:chatId", protect,markChatAsReadController);
router.get("/unread", protect, fetchUnreadChatsController);
module.exports= router;