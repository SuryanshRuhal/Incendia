const expressAsyncHandler = require("express-async-handler");
const { uploadOnCloudinary } = require("../config/cloudinary");
const post = require("../modals/postmodel");
const User = require("../modals/UserModel");
const cloudinary = require('cloudinary').v2;


const postcreatecontroller = expressAsyncHandler(async (req, res) => {
    const caption = req.body.caption;

    const postImgPath = req.file.path;

    let postUrl = "";

    if (postImgPath) {
        if (req.file.mimetype.startsWith('image/') || req.file.mimetype.startsWith('video/')) {
            const uploadpost = await uploadOnCloudinary(postImgPath);
            postUrl = uploadpost.url;
        } else {
           throw new Error("File not Supported");
        }
    }

    if (!req.user || !req.user._id) {
        return res.status(401).send("User not authenticated.");
    }

    if (!caption) {
        throw new Error("Write a caption");
    }
    const newPost = {
        postedby: req.user._id,
        postimg: postUrl,
        caption: caption,
    };

    try {
        var Post = await post.create(newPost);
        await User.findByIdAndUpdate(req.user._id, {
            $push: { posts: Post._id }
        });

        res.status(201).json(Post);
    } catch (error) {
        res.status(401);
        throw new Error("post creation failed");
    }

});

const fetchUserPostController = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('_id');

        const userPosts = await post.find({ postedby: user._id }).populate("postedby", "username avatar");
        res.json(userPosts);
    } catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
})

const feedFetchController = expressAsyncHandler(async (req, res) => {
    const { limit, skip } = req.query;
    try {
        const posts = await post.aggregate([
            { $sample: { size: parseInt(limit) } }
        ]).skip(parseInt(skip));

        const populatedPosts = await post.populate(posts, { path: "postedby", select: "username avatar" });

        res.status(200).json(populatedPosts);
    } catch (error) {
        res.status(401);
        throw new Error("post fetching failed");
    }
})

const fetchUserLikedPosts = expressAsyncHandler(async (req, res) => {
    try {
        const posts = await User.findById(req.params.userId)
            .populate({
                path: "likedposts",
                select: "postedby postimg caption createdAt updatedAt likedby comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "postedby",
                    select: "username avatar"
                }
            })
            .select("likedposts")
            .lean()
            .sort({ createdAt: -1 });
        res.status(201).json(posts);

    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
})


const likeController = expressAsyncHandler(async (req, res) => {
    try {
        if (req.user._id) {
            const POST = await post.findById(req.params.postId);
            const isLiked = POST.likedby.includes(req.user._id);

            if (isLiked) {

                updatedPost = await post.findByIdAndUpdate(req.params.postId,
                    { $pull: { likedby: req.user._id } },
                    {
                        new: true,
                        select: "likedby"
                    }
                );
                await User.findByIdAndUpdate(req.user._id,
                    { $pull: { likedposts: req.params.postId } },
                );
            } else {

                updatedPost = await post.findByIdAndUpdate(req.params.postId,
                    { $addToSet: { likedby: req.user._id } },
                    {
                        new: true,
                        select: "likedby"
                    }
                );
                await User.findByIdAndUpdate(req.user._id,
                    { $addToSet: { likedposts: req.params.postId } }
                );
            }
            return res.status(200).json(updatedPost);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

module.exports = {
    postcreatecontroller,
    fetchUserPostController,
    feedFetchController,
    likeController,
    fetchUserLikedPosts
}