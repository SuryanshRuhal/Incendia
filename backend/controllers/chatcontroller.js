const expressAsyncHandler =require("express-async-handler");
const User= require("../modals/UserModel");
const Chat= require("../modals/chatmodel");
const searchFollowerController= expressAsyncHandler(async(req,res)=>{
    try {
        const {chatuser}= req.body;
        const search= await User.findById(req.user._id).populate({
            path:'following',
            match:{username:{$regex:chatuser, $options:"i"}},
            select: "username avatar"
        }); 
        if (!search) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.status(201).json(search.following); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}) 

const accessChatController= expressAsyncHandler(async(req,res)=>{
    const thisChat= await Chat.findOne({
        users:{ $all:[req.user._id, req.params.chatuserid]}
    }).populate("users", "username avatar")
    .populate("latestMessage");
   if (thisChat) {
    const otherUser = thisChat.users.find(user => user._id.toString() !== req.user._id.toString());
    thisChat.chatname = otherUser.username;
    return res.status(200).json(thisChat);
}
        var newChat= {
            chatname: req.params.chatuserid,
            users:[req.user._id, req.params.chatuserid]
        }
        try {
            let chat= await Chat.create(newChat);
            chat = await chat.populate("users", "username avatar");

            const otherUser = chat.users.find(user => user._id.toString() !== req.user._id.toString());
            chat.chatname = otherUser.username;
    
            await chat.save();
            res.status(201).json(chat);

        } catch (error) {
            res.status(500); 
            throw new Error(error.message);
        }
    
})
const fetchChatController= expressAsyncHandler(async(req,res)=>{
    try {
        let chats= await Chat.find({users: req.user._id})
        .populate("users", "avatar username")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        chats = chats.map(chat => {
            const users = chat.users.map(user => user._id.toString());
            if (users[0] === req.user._id.toString()) {
                [chat.users[0], chat.users[1]] = [chat.users[1], chat.users[0]];
            }
            return chat;
        });
        res.status(201).json(chats);
    } catch (error) {
        res.status(404)
        throw new Error(error.message);
    }
})
module.exports={
    searchFollowerController,
    accessChatController,
    fetchChatController
}
