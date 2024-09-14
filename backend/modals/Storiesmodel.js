const mongoose= require("mongoose");

const storyModel= mongoose.Schema({
    creater:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    story:{
        type:"String",
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: "24h",
    }

});
const Story= mongoose.model("Story",storyModel);
module.exports= Story;