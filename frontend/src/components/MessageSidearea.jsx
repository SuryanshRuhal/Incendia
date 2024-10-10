import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { Backdrop, CircularProgress, } from "@mui/material";
import MessageChatList from "./messageChatList";
import ChatListItem from "./messagechatlistItem";
import axios from "axios";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { useUnreadCount } from "../contexts/UnreadCountContext";

const MessageSideArea = () => {
    const [searchbar, setSearchBar] = useState("");
    const [visible, setVisible] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const {totalUnread}= useUnreadCount();

    const fetchFollowingList = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const senduser= {chatuser: searchbar}
            const response = await axios.post(`https://incendia-api.onrender.com/chats/searchfollowing`, senduser, config);
            setVisible(true);
            setFollowingList(response?.data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}>
            <CircularProgress color="secondary" />
        </Backdrop>
        <div className="flex flex-col h-full">
            <div className="flex gap-1 justify-center items-center ">
                <input type="text" name="chatuser" value={searchbar} placeholder="Search User you are following" onChange={(e) => { setSearchBar(e.target.value) }} className="w-[65%] sm:w-[100%] mb-1 rounded-lg p-0 sm:p-1 text-purple-950  bg-slate-50 border-b-2 shadow-sm border-purple-800 " ></input>
                    <SearchIcon className="!h-6 !w-6 sm:!h-7 sm:!w-7 ml-1 cursor-pointer self-end" onClick={fetchFollowingList} />
            </div>
            {visible && (<div className="bg-white rounded-lg mt-2  pt-0 shadow-lg flex-1 overflow-y-scroll scrollbar-hide::-webkit-scrollbar scrollbar-hide ">
                <div className="flex px-2 bg-teal-50 shadow-md w-full pt-2 justify-between sticky top-0 z-8">
                <p className="font-bold ml-2 mb-2 start-0">Start Conversation </p>
                <p className="text-purple-400 mx-2 mb-2 cursor-pointer end-0" onClick={()=>{setVisible(false)}}> Close </p>
                </div>
                
                <div className="m-2">
                {    (followingList.length===0)?
                    <div className='m-2 text-center italic'>Sorry, No following User Found 🥺</div>
                    :
                followingList.map((list, index) => {
                    return <ChatListItem key={list?._id} userId={list?._id} chatname={list?.username} avatar={list?.avatar} latestmessage={list?.latestmessage} />
                })}
                </div>
            </div>)}
            <div className=" flex-1 overflow-y-scroll scrollbar-hide::-webkit-scrollbar scrollbar-hide mt-3 bg-white rounded-lg  shadow-lg text-sm">
            <div className="flex px-2 bg-teal-50 shadow-md w-full pt-2 justify-between sticky top-0 z-8">
                <p className="font-bold ml-2 my-2">Messages</p>
                    <Badge badgeContent={totalUnread} color="secondary">
                       <NotificationsIcon/>
                    </Badge>
            </div>
            <div className="m-2">
            <MessageChatList />
            </div>
            </div>
        </div>
    </>);
}
export default MessageSideArea;
