import { useState, useEffect } from "react";
import { Backdrop, CircularProgress, } from "@mui/material";
import axios from "axios";
import ChatListItem from "./messagechatlistItem";
const MessageChatList = () => {
    const [loading, setLoading] = useState(false);
    const [chatlist,setChatlist]= useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));

    const fetchChatsHandler=async()=>{
        setLoading(false);
        try {
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${userData?.data?.token}`,
                }
            }
            const response= await axios.get(`https://incendia-api.vercel.app/chats/fetchchats`,config);
            setChatlist(response?.data);
        } catch (error) {
            alert("Chat fetching failed!")
        } finally{
            setLoading(false);
        }
}
useEffect(()=>{
    fetchChatsHandler();
},[])
    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop> 
            <div className="">
                {chatlist.map((list, index) => {
                    return <ChatListItem key={list?._id} id={list?.users[0]?._id} chatname={list?.users[0]?.username} avatar={list?.users[0]?.avatar}  latestmessage={list?.latestMessage}/>
                })}
            </div>
        </> 
    );
}
export default MessageChatList;