const expressAsyncHandler= require("express-async-handler");
const Message = require("../modals/messagemodel");
const Chat= require("../modals/chatmodel");
const mongoose = require("mongoose");
const User= require("../modals/UserModel");

const sendMessageController=expressAsyncHandler(async(req,res)=>{
    const {content, mediaFileUrl}= req.body;
    if(!content && !mediaFileUrl){
        throw new Error("No file & Message Sent");
    }
    const newMessage={
        sender: req.user._id,
        content: content|| "",
        attachMedia: mediaFileUrl || "",
        chat: req.params.chatId
    }
    try {
        const message=await Message.create(newMessage);
        await Chat.findByIdAndUpdate(req.params.chatId,
            {latestMessage: content || "Post Shared"}
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
    const messages= await Message.find({chat:chatId})
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
const sendPostToMultipleUser= expressAsyncHandler(async(req,res)=>{
    const {mediaUrl,recipients}= req.body;
        if(!mediaUrl){
            throw new Error("No post to share");
        }
        if (!recipients || recipients.length === 0) {
            res.status(400);
            throw new Error("No recipients provided");
        }
    try {
        for(const recipientId of recipients){
            const thisChat= await Chat.findOne({
                users:{$all:[req.user._id, recipientId]}
            })
            var chatId= thisChat?._id ||"";
            if(!thisChat){
                const newChat= {
                    chatname: recipientId,
                    users:[req.user._id, recipientId]
                }
                const chat= await Chat.create(newChat);
                const otherUser= chat.users.find(user=>user._id.toString()!== req.user._id.toString());
                chat.chatname= otherUser.username;
                chatId= chat._id;
                await chat.save()
            }

            var newMessage={
                sender: req.user._id,
                content: "",
                attachMedia: mediaUrl,
                chat: chatId
            }
            try {
                const message= await Message.create(newMessage); 
                await Chat.findByIdAndUpdate(chatId,
                    {latestMessage: "Shared you a Post"}
                )       
                const chat = await Chat.findById(chatId);
                const recipientss = chat.users.filter(userId => userId.toString() !== req.user._id.toString());
             await Promise.all(recipientss.map(async (newrecipientId) => {
            const rec = await User.findById(newrecipientId);
            if(rec){
                const existingUnreadChat = rec.unreadChats.find(uc => uc.chat.toString() === chatId);
                if(existingUnreadChat){
                    existingUnreadChat.count +=1;
                } else{
                    rec.unreadChats.push({ chat: chatId, count:1 });
                }
                await rec.save();
            }
        }));

        const io = req.app.get('io');
        io.to(chatId).emit("message received", message);
            } catch (error) {
                throw new Error("Message creation failed");
            }
        }
        res.status(201).json("mesages sent");
    } catch (error) {
        res.status(500);
        throw new Error("failed to send post");
    }
})
module.exports={
    sendMessageController,
    fetchChatMessagesController,
    markChatAsReadController,
    fetchUnreadChatsController,
    sendPostToMultipleUser
}