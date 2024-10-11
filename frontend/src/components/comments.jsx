import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';

const Comment = (props) => {
    const [isliked, setlike] = useState(false);
    const [userlike, setUserLike] = useState(props.likedBy);
    const [replyActive, setReplyActive] = useState(false);
    const [replyInput, setReplyInput] = useState(null);
    const [visibleReplies, setVisibleReplies] = useState({});
    const [replies, setReplies] = useState([]);
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

            const response = await axios.get(`https://incendia-api.onrender.com/comments/liked/${props.id}`, config);
            setUserLike(response?.data?.likedby);
        } catch (error) {
            console.log();
            setlike(previousState);
        }
    }

    useEffect(() => {
        const userId = userData?.data?._id;
        setlike(userlike.includes(userId));
    }, [userlike, userData])

    const toggleRepliesVisibility = (commentId) => {
        setVisibleReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const fetchRepliesHandler = async () => {
        toggleRepliesVisibility(props?.id);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const response = await axios.get(`https://incendia-api.onrender.com/comments/fetchReplies/${props.postid}/parentComment/${props.id}`, config)
            setReplies(response?.data);
        } catch (error) {
            console.log(error.message);
            toggleRepliesVisibility(props?.id);
        }
    }
    return (
        <div>
            <div className={`${props.ispc === " y " ? " flex-col py-2 px-4 my-1 bg-slate-50 rounded-lg flex gap-1 shadow-md justify-between text-sm" : ""}`}>
                <div className="flex items-center my-0 justify-between">
                    <div className={`flex items-center ${props.size === 'sm' ? " gap-2 " : " gap-4 "}`}>
                        <img src={props?.avatar} alt="" className={`${props.size === 'sm' ? " w=8 h-8 " : " w-10 h-10 "} h-5 w-5 rounded-full`} />
                        <span className={`${props.size === 'sm' ? " text-xs " : " text-sm "} text-xs font-medium`}>{props?.username}</span>
                    </div>
                    <MoreHorizIcon />
                </div>
                <div className="flex items-center gap-2">
                    <div className='flex flex-1 flex-col gap-1'>
                        <p className={`${props.size === 'sm' ? " text-xs " : "sm:text-sm"} pl-2  mt-1 text-xs`}>{props?.parentcomment ? `@${props?.parentComment}: ` : ""} {props?.content}</p>
                        <div className={`flex ${props.size === 'sm' ? " !gap-2 " : " !gap-5 "}`}>
                            <div className={` ${props.size === 'lg' ? "gap-4 " : props.size === 'sm' ? " !gap-0 " : " !gap-1"} gap-0 sm:gap-1 lg:gap-2 flex items-center flex-col sm:flex-row bg-white py-1 px-2 rounded-xl`}>
                                {
                                    (isliked) ?
                                        <FavoriteIcon className={`${props.size === 'sm' ? "!text-base" : ""} text-red-600 `} onClick={likeHandler} /> :
                                        <FavoriteBorderIcon className={`${props.size === 'sm' ? "!text-base" : ""} cursor-pointer `} onClick={likeHandler} />
                                }
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className={`${props.size === 'lg' ? " inline " : " !hidden "} text-gray-500  hidden sm:inline`}>{userlike.length} </span>
                            </div>
                            <div className={`${props.size === 'lg' ? " gap-4 " : props.size === 'sm' ? " !gap-0 " : " !gap-1"} gap-0 sm:gap-1 lg:gap-2 flex flex-col sm:flex-row items-center bg-slate-100 py-1 px-2 rounded-xl  `}>
                                <AddCommentIcon className={`${props.size === 'sm' ? "!text-base" : ""} !text-sm cursor-pointer `} onClick={() => setReplyActive(!replyActive)} />
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className={`${props.size === 'lg' ? " inline" : " !hidden "} text-gray-500 hidden sm:inline`}> {props?.replycount} </span>
                            </div>
                            <div className={`flex flex-col sm:flex-row items-center bg-slate-100 py-1 px-2 rounded-xl gap-0 sm:gap-1 lg:gap-2 ${props.size === 'lg' ? "gap-4 " : props.size === 'sm' ? " !gap-0 " : " !gap-1"}`}>
                                <ExpandMoreIcon className={`${props.size === 'sm' ? "!text-base" : ""} cursor-pointer !text-base `} onClick={fetchRepliesHandler} />
                                <span className={`${props.size === 'lg' ? " inline" : " !hidden "} hidden sm:inline text-gray-300`}>|</span>
                                <span className={`${props.size === 'lg' ? " inline" : " !hidden "} hidden text-gray-500 text-center sm:inline`}>View Replies</span>
                            </div>

                        </div>{replyActive &&
                            (<div className={`flex`}>
                                <textarea type="text" name="comment" value={replyInput} onChange={(e) => { setReplyInput(e.target.value) }} placeholder="Reply to Comment??" className={` bg-transparent outline-none flex-1 rounded-lg p-1 "`} />
                                <SendIcon className={`!text-sm cursor-pointer `} onClick={async () => { await props.createCommentHandler(replyInput, props?.id); setReplyInput(""); }} />
                            </div>)}

                        {visibleReplies[props.id] && replies.map((reply, i) => (
                            <Comment key={reply?.commentId} id={reply?.commentId} size={props.size} postid={props.postid} username={reply?.commentedBy?.username}
                                avatar={reply?.commentedBy?.avatar} content={reply?.content} replycount={reply?.replycount}
                                likedBy={reply?.likedBy} parentCommentId={reply?.parentComment} createCommentHandler={props.createCommentHandler} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Comment;