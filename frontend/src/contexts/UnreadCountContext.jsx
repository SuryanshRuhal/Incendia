import { createContext, useContext,useEffect, useState } from "react";
import axios from "axios";

const UnreadCountContext= createContext();

export const useUnreadCount=()=>{
    return useContext(UnreadCountContext);
}

export const UnreadCountProvider=({children})=>{
    const [unreadChats, setUnreadChats]= useState({});
    const userData= JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
        const fetchUnreadChats = async () => {
            if (!userData) return; // Don't fetch if userData is not available
            
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userData.data.token}`,
                    },
                };
                const response = await axios.get(`https://incendia-api.onrender.com/messages/unread`, config);
                setUnreadChatsForUser(response.data);
            } catch (error) {
                console.log("Error fetching unread chats:", error);
            }
        };

        fetchUnreadChats();
    }, [userData]);

    const setUnreadChatsForUser = (chatList) => {
        const unread = {};
        chatList.forEach(chat => {
            unread[chat.chat] = chat.count; 
        });
        setUnreadChats(unread);
    };

    const addUnreadChat = (chatId) => {
        setUnreadChats((prevUnreadChats) => ({
            ...prevUnreadChats,
            [chatId]: (prevUnreadChats[chatId] || 0) + 1
        }));
    };

   
    const markChatAsRead = (chatId) => {
        setUnreadChats((prevUnreadChats) => ({
            ...prevUnreadChats,
            [chatId]: 0
        }));
    };
 
    const resetUnreadChats = () => {
        setUnreadChats({});
    };

    const totalUnread = Object.values(unreadChats).reduce((acc, count) => acc + count, 0);
    return (
        <UnreadCountContext.Provider value={{ unreadChats, setUnreadChatsForUser, addUnreadChat, markChatAsRead, resetUnreadChats, totalUnread }}>
            {children}
        </UnreadCountContext.Provider>
    )
}
