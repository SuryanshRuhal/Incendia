import Comment from "./comments";
import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState, useEffect,useRef } from "react";
import SendIcon from '@mui/icons-material/Send';

const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase(); 
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogg'];
    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    }
}


const Post = (props) => {
    const [isliked, setlike] = useState(false);
    const [userlike, setUserLike] = useState(props.likedby);
    const [commentInput, setCommentInput] = useState(null);
    const [fetchComment, setFetchComment] = useState(false);
    const [firstComment, setFirstComment] = useState([]);
    const [commentCount, setFirstCommentCount] = useState(props?.commentno);
    const [loading, setLoading] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const videoRef = useRef(null);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const fileType = getFileType(props?.postimg);
    const likeHandler = async () => {
        if (debounceTimeout) return;
        const previousState = isliked;
        setlike(!isliked);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const response = await axios.get(`https://incendia-api.onrender.com/post/liked/${props.id}`, config);
            setUserLike(response?.data?.likedby);
        } catch (error) {
            console.log(error.message);
            setlike(previousState);
        }finally {
            const timeout = setTimeout(() => {
                setDebounceTimeout(null);
            }, 1500);
            setDebounceTimeout(timeout); 
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
            const response = await axios.get(`https://incendia-api.onrender.com/comments/fetchFirstComments/${props.id}`, config);
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
            const response= await axios.post(`http://localhost:8080/comments/postId/${props.id}/parentComment/${parentCommentId || ''}`, payload, config);
            setFirstCommentCount(response?.data?.comments);
        } catch (error) {
            console.log("Comment Not Created");

        } finally {
            setLoading(false);
        }
    }
   
    useEffect(() => {
        if (fileType !== 'video') return;
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!videoElement.paused) {
                        videoElement.pause();
                    }
                    videoElement.play().catch(error => {
                        console.log("Auto-play was prevented:", error);
                    });
                } else {
                    if (!videoElement.paused) {
                    videoElement.pause();
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5,
        });

        observer.observe(videoElement);
        return () => {
            observer.unobserve(videoElement);
        };
    }, [fileType]);

    return (
        <div className="flex-col p-4 sm:p-6 my-4 bg-white rounded-lg flex gap-2 shadow-md justify-between text-sm">
            {/* User */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                    <img src={props?.postedby?.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <span className="font-medium">{props?.postedby?.username}</span>
                </div>
                <MoreHorizIcon className="cursor-pointer" />
            </div>
            {/* Description */}
            <div className="flex mt-1  flex-col gap-2 sm:gap-4">
                <div className="w-full relative">
                {fileType === 'image' && (
                        <img src={props?.postimg} alt="Post media" className="object-cover rounded-md w-full" />
                    )}
                  {fileType === 'video' && (
                        <video  ref={videoRef} muted playsInline controls className="object-cover rounded-md w-full">
                            <source src={props?.postimg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        
                    )} 
                </div>
                <p className={` ${props.size === 'sm' ? "text-xs " : props.size === 'md' ? "text-sm " : " text-base "} m-2`} >
                    <span className="font-bold ">{props?.postedby?.username}:  </span>
                    {props?.caption}
                </p>
            </div>
            {/* Interaction*/}
            <div className={` ${props.size === 'lg' ? " " : " !flex-col !my-2 "} my-1 flex-col sm:flex-row flex items-center justify-between sm:my-4 text-sm `}>
                <div className={`flex gap-6`}>
                    <div className={` ${props.size === 'sm' ? "gap-2 " : "sm:gap-4 "} gap-2 flex items-center bg-slate-100 p-2 rounded-xl`}>
                        {
                            (isliked) ?
                                <FavoriteIcon className={`${props.size === 'sm' ? "!text-base" : ""} text-red-600 cursor-pointer`} onClick={likeHandler} /> :
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
                        <span className="text-gray-500 text-xs sm:text-base">{commentCount?.length}
                            <span className={`${props.size === 'sm' ? "hidden " : "inline"} text-xs sm:text-base`}> Comment</span>
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

export default React.memo(Post);