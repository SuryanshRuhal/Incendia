import { createContext, useContext, useState } from "react";

const UnreadCountContext= createContext();

export const useUnreadCount=()=>{
    return useContext(UnreadCountContext);
}

export const UnreadCountProvider=({children})=>{
    const [unreadChats, setUnreadChats]= useState({});
    const addUnreadChat= (chatId)=>{
        setUnreadChats((prevUnreadChats)=>{
            console.log("add start");
            if(prevUnreadChats[chatId]){
                console.log("add false");
                return  prevUnreadChats;
            }
            console.log("add true");
            return {...prevUnreadChats, [chatId]:true};
        })
    }

    const markChatAsRead= (chatId)=>{
        setUnreadChats((prevUnreadChats)=>{
            console.log("mark start");
            if(!prevUnreadChats[chatId]){
                console.log("mark false");
                return prevUnreadChats;
            }
            console.log("mark true");
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
