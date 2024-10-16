const expressAsyncHandler= require("express-async-handler");
const Message = require("../modals/messagemodel");
const Chat= require("../modals/chatmodel");
const mongoose = require("mongoose");
const User= require("../modals/UserModel");

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
        await message.populate("chat","users");

        const chat = await Chat.findById(req.params.chatId);
       
        const recipients = chat.users.filter(userId => userId.toString() !== req.user._id.toString());

        await Promise.all(recipients.map(async (recipientId) => {
            const recipient = await User.findById(recipientId);
            if(recipient){
                const existingUnreadChat = recipient.unreadChats.find(uc => uc.chat.toString() === req.params.chatId);
                if(existingUnreadChat){
                    existingUnreadChat.count +=1;
                } else{
                    recipient.unreadChats.push({ chat: req.params.chatId, count:1 });
                }
                await recipient.save();
                
            }
        }));

        const io = req.app.get('io');
        io.to(req.params.chatId).emit("message received", message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500);
        throw new Error("Message creation failed");
    }
});

const fetchChatMessagesController= expressAsyncHandler(async(req,res)=>{
   try {
    const messages= await Message.find({chat:req.params.chatId})
    .populate("chat", "users")
    .sort({updatedAt:1});
    res.status(201).json(messages);
   } catch (error) {
        res.status(500);
        throw new Error("Message creation failed");
   }
})

const markChatAsReadController = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.params;
    try {
        // const objectId = mongoose.Types.ObjectId(chatId);
        const result = await User.updateOne(
            { _id: req.user._id },
            { $pull: { unreadChats: { chat:chatId } } } 
        );
        res.status(200).json({ message: "Chat marked as read" });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to mark chat as read");
    }
});

const fetchUnreadChatsController = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('unreadChats.chat', 'chatName');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.unreadChats);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch unread chats");
    }
});
module.exports={
    sendMessageController,
    fetchChatMessagesController,
    markChatAsReadController,
    fetchUnreadChatsController
}