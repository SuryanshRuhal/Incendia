const expressAsyncHandler= require("express-async-handler");
const Message = require("../modals/messagemodel");
const Chat= require("../modals/chatmodel");

const sendMessageController=expressAsyncHandler(async(req,res)=>{
    const {content}= req.body;

    const newMessage={
        sender: req.user._id,
        content: content,
        chat: req.params.chatId
    }
    try {
        const message=await Message.create(newMessage);
        await Chat.findByIdAndUpdate(req.params.chatId,
            {latestMessage: content}
        )
        res.status(201).json(message);
    } catch (error) {
        res.status(500);
        throw new Error("Message creation failed");
    }
});

const fetchChatMessagesController= expressAsyncHandler(async(req,res)=>{
   try {
    const messages= await Message.find({chat:req.params.chatId})
    .sort({updatedAt:1});
    res.status(201).json(messages);
   } catch (error) {
        res.status(500);
        throw new Error("Message creation failed");
   }
})

module.exports={
    sendMessageController,
    fetchChatMessagesController
}