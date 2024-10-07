// src/contexts/socketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUnreadCount } from './UnreadCountContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context.socket;
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { addUnreadChat } = useUnreadCount();
    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
        if (!userData?.data?._id) {
           
            return;
        }

        const newSocket = io("https://incendia-api.vercel.app");
        setSocket(newSocket);

        newSocket.emit("setup", userData?.data);

        newSocket.on("connected", () => {
           
        });

        
        newSocket.on("message recieved", (newMessageRecieved) => {
            if (newMessageRecieved.chat._id) {
                addUnreadChat(newMessageRecieved.chat._id);
            }
        });

        // Optionally handle 'typing' and 'stop typing' events globally
        newSocket.on("typing", (room) => {
            // You can implement global typing indicators here if needed
        });

        newSocket.on("stop typing", (room) => {
            // Handle global stop typing indicators
        });

       
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
