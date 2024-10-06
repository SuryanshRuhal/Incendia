const mongoose= require("mongoose");

const chatModel= mongoose.Schema({
    chatname:{
        type: String,
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    latestMessage:{
        type: "String",
        default:"",
    }
},{
    timestamps: true,
});
const Chat = mongoose.model("Chat", chatModel);
module.exports=Chat;