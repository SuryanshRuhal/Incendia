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
    const totalUnread = Object.keys(unreadChats).length;
    return (
        <UnreadCountContext.Provider value={{ unreadChats, addUnreadChat, markChatAsRead, totalUnread }}>
            {children}
        </UnreadCountContext.Provider>
    )
}
