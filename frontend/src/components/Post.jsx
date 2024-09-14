import Comment from "./comments";
import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ShareIcon from '@mui/icons-material/Share';
import { useState, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';


const Post = (props) => {
    const [isliked, setlike] = useState(false);
    const [userlike, setUserLike] = useState(props.likedby);
    const [commentInput, setCommentInput] = useState(null);
    const [fetchComment, setFetchComment] = useState(false);
    const [firstComment, setFirstComment] = useState([]);
    const [loading, setLoading] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const likeHandler = async () => {
        const previousState = isliked;
        setlike(!isliked);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const response = await axios.get(`http://localhost:8080/post/liked/${props.id}`, config);
            setUserLike(response?.data?.likedby);
        } catch (error) {
            console.log(error.message);
            setlike(previousState);
        }
    }
    useEffect(() => {
        const userId = userData?.data?._id;
        setlike(userlike.includes(userId));
    }, [userlike, userData])

    const fetchFirstCommentsHandler = async () => {

        const previousState = fetchComment;
        setFetchComment(!fetchComment);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const response = await axios.get(`http://localhost:8080/comments/fetchFirstComments/${props.id}`, config);
            setFirstComment(response?.data);
           
        } catch (error) {
            console.log(error.message);
            setFetchComment(previousState);
        }
    }

    const createCommentHandler = async (commentText, parentCommentId = null) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const payload = { comment: commentText };
            await axios.post(`http://localhost:8080/comments/postId/${props.id}/parentComment/${parentCommentId || ''}`, payload, config);


        } catch (error) {
            console.log("Comment Not Created");

        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex-col p-6 my-4 bg-white rounded-lg flex gap-4 shadow-md justify-between text-sm">
            {/* User */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={props?.postedby?.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <span className="font-medium">{props?.postedby?.username}</span>
                </div>
                <MoreHorizIcon className="cursor-pointer" />
            </div>
            {/* Description */}
            <div className="flex mt-4 flex-col gap-4">
                <div className="w-full relative">
                    <img src={props?.postimg} alt="" fill className="object-cover rounded-md" />
                </div>
                <p className={` ${props.size === 'sm' ? "text-xs " : props.size === 'md' ? "text-sm " : " text-base "} m-2`} >
                    <span className="font-bold ">{props?.postedby?.username}:  </span>
                    {props?.caption}
                </p>
            </div>
            {/* Interaction*/}
            <div className={` ${props.size === 'lg' ? " " : " !flex-col !my-2 "} my-2 flex-col sm:flex-row flex items-center justify-between sm:my-4 text-sm `}>
                <div className={`flex gap-6`}>
                    <div className={` ${props.size === 'sm' ? "gap-2 " : "sm:gap-4 "} gap-2 flex items-center bg-slate-100 p-2 rounded-xl`}>
                        {
                            (isliked) ?
                                <FavoriteIcon className={`${props.size === 'sm' ? "!text-base" : ""} text-red-600 `} onClick={likeHandler} /> :
                                <FavoriteBorderIcon className={`${props.size === 'sm' ? "!text-base" : ""} cursor-pointer `} onClick={likeHandler} />
                        }
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 text-xs sm:text-base">{userlike?.length}
                            <span className={`${props.size === 'sm' ? "hidden " : " inline "} text-xs sm:text-base`}> Likes</span>
                        </span>
                    </div>
                    <div className={`flex items-center bg-slate-100 p-2 rounded-xl ${props.size === 'lg' ? "sm:gap-4 " : "gap-2 "} gap-2`}>
                        <MessageIcon className={`${props.size === 'sm' ? "!text-base" : ""} cursor-pointer `} onClick={fetchFirstCommentsHandler} />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 text-xs sm:text-base">{props?.commentno}
                            <span className={`${props.size === 'sm' ? "hidden " : "inline"} text-xs sm:text-base`}> Comment</span>
                        </span>
                    </div>
                </div>
                <div>
                    <div className={` ${props.size === 'lg' ? " " : " !mt-3 "} mt-4 sm:mt-0 flex items-center bg-slate-100 gap-4 p-2 rounded-xl`}>
                        <ShareIcon className=" cursor-pointer " />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">123
                            <span className={`${props.size === 'sm' ? "hidden " : "inline"}`}> Share</span>
                        </span>
                    </div>
                </div>
            </div>
            {
                loading ?
                    <Backdrop
                        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}>
                        <CircularProgress color="secondary" />
                    </Backdrop>
                    :
                    <div className={`flex items-center ${props.size === 'lg' ? " gap-4 " : " gap-1 "} `}>
                        <img src={userData?.data?.avatar} alt="" className={`${props.size === 'lg' ? "  sm:w-16 sm:h-16 " : props.size === 'md' ? " w-10 h-10 " : " w-8 h-8 "} h-12 w-12 rounded-full ring-2 `} />
                        <div className={`flex flex-1  justify-center bg-slate-100 rounded-xl w-full  ${props.size === 'lg' ? "text-xs sm:text-sm px-2 py-2 sm:px-6 sm:py-2 gap-1 sm:gap-4 " : " text-xs px-2 py-1 gap-1 "} `}>
                            <textarea type="text" name="comment" value={commentInput} onChange={(e) => { setCommentInput(e.target.value) }} placeholder="Write a Comment??" className={`bg-transparent outline-none flex-1 rounded-lg p-1 ${props.size === 'lg' ? "  " : " w-[90%] "}`} />
                            <style jsx>{`textarea::placeholder {font-size: ${props.size === 'lg' ? '' : 'text-xs'};}`}</style>
                            <SendIcon className={` cursor-pointer self-end  ${props.size === 'lg' ? "  sm:!h-10 sm:!w-10  " : "!h-6 !w-6 "} h-7 w-7 `} onClick={async() => {  await createCommentHandler(commentInput);  setCommentInput("");  }} />
                        </div>
                    </div>
            }

            <div className={`${fetchComment ? "hidden" : ""}`}>
                {firstComment.map((comment, i) => (
                    <Comment key={comment?.commentId} id={comment?.commentId} size={props.size} postid={props.id} username={comment?.commentedBy?.username}
                    avatar={comment?.commentedBy?.avatar} content={comment?.content} replycount={comment?.replyCount} ispc="y"
                    likedBy={comment?.likedBy} parentCommentId={comment?.parentComment} createCommentHandler={createCommentHandler} />
                ))}
            </div>
        </div>
    )
}

export default Post;