const expressAsyncHandler =require("express-async-handler");
const Comment = require("../modals/commentmodel");
const post = require("../modals/postmodel");

const createCommentController= expressAsyncHandler(async(req,res)=>{
  
    const {comment}= req.body;
    if(!req.params.postId){
        throw new Error("post not found");
    }
    var newComment={
        commentedBy:req.user._id,
        content:comment,
        post: req.params.postId,
    }
    if(req.params.commentId){
        newComment.parentComment=req.params.commentId;    
      } 

    try {
        const comment= await Comment.create(newComment);
        if(req.params.commentId){
            await Comment.findByIdAndUpdate(req.params.commentId,{
                $push: {reply: comment._id}
            }); 
          } 
        await post.findByIdAndUpdate(req.params.postId,{
            $push:{comments: comment._id}
        });

        res.status(201).json({ message: "Comment created successfully" });
   
    } catch (error) {
        res.status(500)
        throw new Error("Comment Creation Failed");
    }
});

const fetchFirstCommentsController= expressAsyncHandler(async(req,res)=>{
    
    try {
        const comments= await Comment.find({post:req.params.postId, parentComment:null})
    .populate("commentedBy","username avatar")
    .select("commentedBy content parentComment createdAt likedby reply ")
    .lean()
   .sort({createdAt:-1});
    const commentsWithCounts = comments.map(comment => ({
        commentId: comment?._id, 
        commentedBy: comment?.commentedBy,      
        content: comment?.content,           
        parentComment: comment.parentComment || null, 
        createdAt: comment?.createdAt,           
        likedBy: comment?.likedby,   
        replyCount: comment?.reply?.length       
    }));
    res.status(202).json(commentsWithCounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
   
    }
});

const fetchReplyCommentController=expressAsyncHandler(async(req,res)=>{
   
    try {
        
    const replies= await Comment.find({post:req.params.postId, parentComment: req.params.commentId})
    .populate("commentedBy", "username avatar")
    .select("commentedBy content parentComment createdAt likedby reply")
    .lean()
    .sort({createdAt:-1})
    const fullreplies= replies.map(reply=>({
        commentId: reply?._id, 
        commentedBy: reply?.commentedBy,
        content: reply?.content,
        parentComment: reply?.parentComment,
        createdAt: reply?.createdAt,
        likedBy: reply?.likedby,
        replycount: reply?.reply?.length
    }))
    
    res.status(202).json(fullreplies);
    
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
   
    }
})

const likeCommentController= expressAsyncHandler(async(req,res)=>{
    try {
        if(req.user._id){
            const COMMENT= await Comment.findById(req.params.commentId);
            const isLiked = COMMENT.likedby.includes(req.user._id);
            
        if(isLiked){

            updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,
                {$pull:{likedby: req.user._id}},
                {new:true,
                select:"likedby"
                }
            );
        }else{

             updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,
                {$addToSet:{likedby:req.user._id}},
                {
                new:true,
                select:"likedby"
                }
            );
        }
          return res.status(200).json(updatedComment);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})
module.exports={
    createCommentController,
    fetchFirstCommentsController,
    fetchReplyCommentController,
    likeCommentController
}