const expressAsyncHandler = require("express-async-handler");
const expreAsyncHandler= require("express-async-handler");

const User = require("../modals/UserModel");

const sendRequestController= expreAsyncHandler(async(req,res)=>{
    try {   
        await User.findByIdAndUpdate(req.params.userId,{
            $push: {followrequests: req.user._id }
        }
    )
    res.status(201);
    } catch (error) {
        res.status(401);
        throw new Error("follow request not sent");
    }
});

const fetchRequestsController= expressAsyncHandler(async(req,res)=>{
    try {
        const requests= await User.findById(req.user._id)
        .select("followrequests")
        .populate("followrequests",
            "avatar username"
        ).lean();
        res.status(200);
        res.send(requests);
    } catch (error) {
        res.status(404);
        throw new Error("No Request found");
    }
})

const acceptRequestController= expreAsyncHandler(async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $addToSet: {followers: req.params.userId}
        });
        await User.findByIdAndUpdate(req.params.userId,{
            $addToSet: {following: req.user._id }
        });
        await User.findByIdAndUpdate( req.user._id,
            { $pull: { followrequests: req.params.userId} }, 
            { new: true } 
        );
        res.status(201);
        
    } catch (error) {
        throw new Error("Accepting Request fail");
    }
});
const cancelRequestController= expreAsyncHandler(async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,
            {$pull:{followrequests: req.params.userId}},
            {new:true}
        );
        
    } catch (error) {
        throw new Error("Cancel Request");
    }
})

const checkFollowStatus = async (req, res) => {
    
    try {
        const { userId } = req.params;
        const currentUser = await User.findById(req.user._id);
        const isFollowedBack = currentUser.following.includes(userId);
        const isFollowing = currentUser.followers.includes(userId);
       
        res.status(200).json({ isFollowing, isFollowedBack });
    } catch (error) {
        res.status(500).json({ message: 'Error checking follow status' });
    }
};

module.exports={
    sendRequestController,
    fetchRequestsController,
    acceptRequestController,
    cancelRequestController,
    checkFollowStatus
}