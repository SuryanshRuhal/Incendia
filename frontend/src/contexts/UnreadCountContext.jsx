import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UnreadCountContext = createContext();

export const useUnreadCount = () => {
    return useContext(UnreadCountContext);
};

export const UnreadCountProvider = ({ children }) => {
    const [unreadChats, setUnreadChats] = useState([]);
    const [count,setCount] = useState(0);
    const [userData, setUserData] = useState(() => {
        const data = localStorage.getItem("userData");
        return data ? JSON.parse(data) : null;
    });

    const fetchUnreadChats = async (token) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(
                "http://localhost:8080/messages/unread",
                config
            );
            setUnreadChats(response?.data);
        } catch (error) {
            console.log("Error fetching unread chats:", error);
        }
    };

    useEffect(() => {
       
        if (userData && userData?.token) {
            fetchUnreadChats(userData?.token);
        } else {
            setUnreadChats([]); 
        }
    }, [userData?.token]); 

  
    useEffect(() => {
        const handleStorageChange = () => {
            const data = localStorage.getItem("userData");
            setUserData(data ? JSON.parse(data) : null);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const setUnreadChatsForUser = (chatList) => {
        setUnreadChats(chatList);
    };

    const addUnreadChat = (chatId) => {
       
        setUnreadChats((prevUnreadChats) => {
            const chatIndex = prevUnreadChats.findIndex(
                (chat) => chat?.chat.toString() === chatId.toString()
            );

            if (chatIndex !== -1) {
                const updatedChats = [...prevUnreadChats];
                updatedChats[chatIndex].count += 1;
                console.log(updatedChats[chatIndex].count);
                return updatedChats;
            } else {
                return [...prevUnreadChats, { chat: chatId, count: 1 }];
            }
        });
    };

    const markChatAsRead = (chatId) => {
        setUnreadChats((prevUnreadChats) => {
            const updatedChats = prevUnreadChats.map((chat) => {
                if (chat.chat.toString() === chatId.toString()) {
                    return { ...chat, count: 0 };
                }
                return chat;
            });
            return updatedChats;
        });
    };

    const resetUnreadChats = () => {
        setUnreadChats([]);
    };

    const totalUnread = unreadChats.filter((chat) => chat.count > 0).length;

    const getUnreadCountForChat = (chatId) => {
        const chat = unreadChats.find(
            (chat) => chat?.chat?.toString() === chatId?.toString()
        );
        return chat ? chat.count : 0;
    };

    const contextValue = {
        unreadChats,
        setUnreadChatsForUser,
        addUnreadChat,
        markChatAsRead,
        resetUnreadChats,
        totalUnread,
        getUnreadCountForChat,
    };

    return (
        <UnreadCountContext.Provider value={contextValue}>
            {children}
        </UnreadCountContext.Provider>
    );
};
