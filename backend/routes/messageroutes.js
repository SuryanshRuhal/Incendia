const express= require("express");
const { sendMessageController, fetchChatMessagesController, markChatAsReadController } = require("../controllers/messagecontroller");
const { protect } = require("../middleware/authorizationmiddleware");
const router= express.Router();

router.post("/newmessage/:chatId",protect,sendMessageController);
router.get("/fetchmessages/:chatId", protect, fetchChatMessagesController);
router.put("/markasread/:chatId", protect,markChatAsReadController);
module.exports= router;