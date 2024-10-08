import { createContext, useContext, useState } from "react";

const UnreadCountContext= createContext();

export const useUnreadCount=()=>{
    return useContext(UnreadCountContext);
}

export const UnreadCountProvider=({children})=>{
    const [unreadChats, setUnreadChats]= useState({});
    const addUnreadChat= (chatId)=>{
        setUnreadChats((prevUnreadChats)=>{
            
            if(prevUnreadChats[chatId]){
                return  prevUnreadChats;
            }
            return {...prevUnreadChats, [chatId]:true};
        })
    }

    const markChatAsRead= (chatId)=>{
        setUnreadChats((prevUnreadChats)=>{

            if(!prevUnreadChats[chatId]){
                return prevUnreadChats;
            }
            const { [chatId]: _, ...rest } = prevUnreadChats;
            return rest;
        })
    }
    const setUnreadChatsForUser = (chatList) => {
        const unread = {};
        chatList.forEach(chat => {
            unread[chat.id] = true; 
        });
        setUnreadChats(unread);
    };

    const resetUnreadChats = () => {
        setUnreadChats({});
    };
    const totalUnread = Object.keys(unreadChats).length;
    return (
        <UnreadCountContext.Provider value={{ unreadChats, addUnreadChat, markChatAsRead, setUnreadChats, resetUnreadChats, totalUnread }}>
            {children}
        </UnreadCountContext.Provider>
    )
}
