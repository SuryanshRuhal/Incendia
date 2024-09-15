const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors =require("cors");

dotenv.config();

app.use(
  cors({
    origin: "*",
  })
);

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

app.use("/user",userroutes);
app.use("/post",postroutes);
app.use("/stories", storyroutes);
app.use("/comments", commentroutes);

app.get("/", (req, res) => {
    res.send("API is Activated");
  });

  
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(PORT));