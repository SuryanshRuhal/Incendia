const mongoose= require("mongoose");
const bcrypt= require("bcryptjs");

const userModel= mongoose.Schema(
    {
    fname:{
        type: String,
        required:true,
    },
    lname:{
        type: String,
        required:true,
    },
    username:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        required:true,
    },
    birthday:{
        type: Date, 
        default: Date.now ,
    },
    avatar:{
        type: String,
        default: "https://i.pinimg.com/originals/1f/0b/fb/1f0bfb3014d612941a035b14ea227b85.jpg",
    },
    living:{
        type: String,
        default: "",
    },
    bio:{
        type: String,
        default: "",
    },
    creationdate:{
        type: Date, 
        default: Date.now ,
    },
    followers:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[],
    },
    following:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[],
    },
    followrequests:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[],
    },
    posts:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "post",
        default:[],
    },
    stories:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Story",
        default:[],
    },
    likedposts:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "post",
        default:[],
    },
    unreadChats:[
        {
            chat:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Chat",
                required: true,
            },
            count:{
                type:Number,
                default:0,
                min:0,
            }
        }
    ]
},{
    timestamps:true,
})

userModel.methods.matchPassword= async function(enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password);
}

userModel.pre("save",async function(next){
    if(!this.isModified){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
});

const User= mongoose.model("User", userModel);
module.exports= User;
