const  mongoose  = require("mongoose");

const commentModel= mongoose.Schema({
    commentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content:{
        type: "String",
        required: true,
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"post",
    },
    likedby:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[],
    },
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment",
        default:null,
    },
    reply:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"comment",
        default:[],
    }],
    createdAt:{
        type:Date,
        default: Date.now,
    }
});

const Comment= mongoose.model("comment",commentModel);
module.exports=Comment;