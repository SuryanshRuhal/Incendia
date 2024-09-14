const mongoose= require("mongoose");

const postModel= mongoose.Schema({
    postedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    postimg: {
        type:"String",
        required: true,
    },
    caption:{
        type:"String",
        required:true,
    },
    createdAt:{
        type: Date, 
        default: Date.now ,
    },
    updatedAt:{
        type: Date, 
        default: Date.now ,
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default:[],
    },
    likedby:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[],
    }
})
const post= mongoose.model("post", postModel);
module.exports=post;