const expressAsyncHandler = require("express-async-handler");
const { uploadOnCloudinary } = require("../config/cloudinary");
const User = require("../modals/UserModel");
const Story = require("../modals/Storiesmodel");

const createStoryController = expressAsyncHandler(async (req, res) => {
    const StoryBuffer = req.file?.buffer;

    let storyurl = "";
    if (StoryBuffer) {
        let resourceType;
        if(req.file.mimetype.startsWith('image/')){
            resourceType = 'image';
        } else if(req.file.mimetype.startsWith('video/')){
            resourceType='video'
        }else if (req.file.mimetype.startsWith('audio/')) {
            resourceType = 'raw';
        } else{
            throw new Error("File Type Not Supported");
        }

        const uploadStory = await uploadOnCloudinary(StoryBuffer,resourceType);
        if(uploadStory){
            storyurl = uploadStory.url|| uploadStory.secure_url;
        }else {
            throw new Error("Failed to upload file to Cloudinary.");
        }
       
    }

    if (!req.user || !req.user._id) {
        return res.status(401).send("User not authenticated.");
    }
    const newStory = {
        creater: req.user._id,
        story: storyurl,
    }
    try {
        
        var StoryCreated = await Story.create(newStory);
        
        await User.findByIdAndUpdate(req.user._id, {
            $push: { stories: StoryCreated._id }
        });
        res.status(201).json(StoryCreated);
    } catch (error) {
        res.status(401);
        throw new Error("Story creation failed!");

    }
});

const fetchStoryFollowersController = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("followers").populate({
            path: "followers",
            select: "_id username avatar stories",
            populate: {
                path: "stories",
                select: "createdAt"
            }
        });
        const storyFollower = user.followers.filter(follower => {
            return follower.stories.some(story => {
                return new Date(story.createdAt) >= new Date(Date.now() - 24 * 60 * 60 * 1000);
            });
        });
        res.status(200).json(storyFollower);
    } catch (error) {
        res.status(500)
        throw new Error("fetch stories failed");
    }
});

const fetchStoriesController = expressAsyncHandler(async (req, res) => {
    ;
    try {
        
        const user = await User.findById(req.params.userId).populate({
            path: 'stories',
            match: { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            select: "story createdAt",
            populate: {
                path: "creater",
                select: "_id username avatar"
            }
        })
        
        const story = {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            stories: user.stories.map((story) => ({
                story: story.story,
                createdAt: story.createdAt,
            })),
        };
        res.status(200).json(story)
    } catch (error) {
        throw new Error("No Story Fetched");
    }
})

module.exports = {
    createStoryController,
    fetchStoryFollowersController,
    fetchStoriesController
}