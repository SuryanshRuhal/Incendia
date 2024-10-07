const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors =require("cors");

dotenv.config();

app.use(cors({
  origin: "*"
}));

const connectDb= async()=>{
  try {
    const connect=await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is Connected");
  } catch (err) {
    console.log("Database is not Connected",err.message);
  }
}
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userroutes= require("./routes/userroute");
const postroutes= require("./routes/postroutes");
const storyroutes= require("./routes/storiesroutes");
const commentroutes= require("./routes/commentroutes");
const chatroutes= require("./routes/chatroutes");
const messageroutes= require("./routes/messageroutes");

app.use("/user",userroutes);
app.use("/post",postroutes);
app.use("/stories", storyroutes);
app.use("/comments", commentroutes);
app.use("/chats", chatroutes);
app.use("/messages",messageroutes);
app.get("/", (req, res) => {
    res.send("API is Activated");
  });

  
const PORT = process.env.PORT || 8080;
const server= app.listen(PORT, console.log(PORT));
const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin: "https://incendia-rho.vercel.app",
  }
})

io.on("connection",(socket)=>{

  socket.on("setup",(userData)=>{
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat",(room)=>{
    socket.join(room);
  });

  socket.on("typing",(room)=>socket.in(room).emit("typing"));
  socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

  socket.on("new message",(newmessageRecieved)=>{
    var chat= newmessageRecieved.chat;
    if(!chat.users) return console.log("users not found")
    chat.users.forEach(user=>{
    if(user== newmessageRecieved.sender) return;
    socket.in(user).emit("message recieved", newmessageRecieved) 
    })
  })
}) 