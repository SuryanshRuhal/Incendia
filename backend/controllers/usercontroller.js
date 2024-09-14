const expressAsyncHandler =require("express-async-handler");
const generatetoken= require("../config/generatetoken");
const userModel = require("../modals/UserModel");
const {uploadOnCloudinary}  =require("../config/cloudinary");
const { omitUndefined } = require("mongoose");

const registercontroller= expressAsyncHandler(async (req, res)=>{
    const {fname, lname, username, creationdate, email, password }= req.body;

    if(!fname || !lname || !username || !email || !password ){
        throw Error(" ALL Fields Are Required! ");
    }

    const userexist=  await userModel.findOne({email});
    if(userexist){
        throw new Error("You Already Have An Account");
    }

    const usernameExist = await userModel.findOne({username});
    if(usernameExist){
        throw new Error("UserName Already Taken! ");
        
    }
    const user = await userModel.create({fname, lname, username, creationdate, email, password });
    if(user){
        
        res.status(201).json({
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            creationdate: Date.now(),
            email: user.email,
            token:generatetoken(user._id),
        });

    } else{
        res.status(401);
        throw new Error("Registeration Failed");
    }
});

const logincontroller= expressAsyncHandler(async (req, res)=>{
    const {email,password} = req.body;

    const user= await userModel.findOne({email});
    if(user && await user.matchPassword(password)){
        const response={
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            creationdate: user.creationdate,
            email: user.email,
            avatar:user.avatar,
            living:user.living,
            bio:user.bio,
            birthday:user.birthday,
            followers:user.followers,
            following:user.following,
            stories:user.stories,
            followrequest:user.followrequest,
            posts:user.posts,
            token: generatetoken(user._id),
        }
        res.json(response);
    }else{
        res.send(401);
        throw new Error("Incorrect Username or Password");
    }
});
const userInfocontroller = expressAsyncHandler(async (req, res) => {
    const update = req.body;
    const avatarLocalPath = req.file ? req.file.path : null;
    if (avatarLocalPath) {
        const uploadResult = await uploadOnCloudinary(avatarLocalPath);
        update.avatar= uploadResult.url;
    }

    const user = await userModel.findByIdAndUpdate(
        req.params.userId,
        update,
        { new: true, omitUndefined:true } 
    );

    if (user) {
        user._doc.token = generatetoken(user._id);
        res.status(201).json(user);
    } else {
        res.status(401);
        throw new Error("Profile update failed");
    }
});
const fetchperticularUsercontroller= expressAsyncHandler(async(req,res)=>{
    try {
        const user= await userModel.findOne({username:req.params.username});
        res.json(user);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

const fetchFollowerController= expressAsyncHandler(async(req,res)=>{
    try {

        const followers= await userModel.findOne({username:req.params.username})
        .select("followers")
        .populate({
            path: "followers",
            select: "username avatar",
        });
        res.status(201).json(followers);
    } catch (error) {
        throw new Error("Error in fetching followers");
    }
})

const fetchFollowingController= expressAsyncHandler(async(req,res)=>{
    try {
        const following= await userModel.findOne({username: req.params.username})
    .select("following")
    .populate({
        path:"following",
        select:"username avatar",
    });
    res.status(201).json(following);
    } catch (error) {
        throw new Error("Error in fetching followers");
    }
})
const fetchSuggestionsController= expressAsyncHandler(async(req,res)=>{
    const {limit}= req.query;
    try {
        const suggestions= await userModel.aggregate([
            { $match: { _id: { $ne: req.user._id } } },
            {$sample:{size:parseInt(limit)}}
        ]);
        res.status(200).json(suggestions);
        
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
})


module.exports={
    registercontroller,
    logincontroller,
    userInfocontroller,
    fetchperticularUsercontroller,
    fetchSuggestionsController,
    fetchFollowerController,
    fetchFollowingController
}