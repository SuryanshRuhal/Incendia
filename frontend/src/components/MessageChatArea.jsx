import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import MessageText from './Messagetext';
import { useUnreadCount } from '../contexts/UnreadCountContext';
import {useSocket} from "../contexts/socketContext";


const MessageChatArea=(props)=>{
    const userData= JSON.parse(localStorage.getItem("userData"));
    const [newMessage, setNewMessage]= useState("");
    const [messageList, setMessageList]= useState([]);
    const {chatId}= useParams();
    const messagesEndRef = useRef(null);
    const navigate= useNavigate();
    const location = useLocation();
    const {username, avatar}= location.state||{};
    const [typing, setTyping]= useState(false);
    const [isTyping, setIsTyping]= useState(false);
    const {addUnreadChat, markChatAsRead}= useUnreadCount();
    const socket= useSocket();

    const fetchMessageHandler=async()=>{
        try {
            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization :`Bearer ${userData?.data?.token}`,
                }
            }
            console.log("new");
            const response= await axios.get(`https://incendia-api.onrender.com/messages/fetchmessages/${chatId}`, config );
            setMessageList(response?.data);
            socket.emit("join chat", chatId);
            const latestMessage = response?.data[response?.data.length - 1];
            if (latestMessage && latestMessage.sender.toString() !== userData?.data?._id.toString()) {
                markChatAsRead(chatId);
                 await axios.put(`https://incendia-api.onrender.com/messages/markasread/${chatId}`, {}, config);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const createMessageHandler=async()=>{
        if (newMessage.trim() === "") return;
        socket.emit("stop typing", chatId);
        try {
            const config={
                headers:{
                   "Content-Type":"application/json",
                   Authorization: `Bearer ${userData?.data?.token}`, 
                }
            }
            const data= {content: newMessage};
            const response= await axios.post(`https://incendia-api.onrender.com/messages/newmessage/${chatId}`,data,config);
            // socket.emit("new message",response?.data);
            setMessageList((prevMessages) => [...prevMessages, response.data]);
            setNewMessage("");
            
        } catch (error) {
            console.log(error);
        }
    }
    const typeHandler=(e)=>{
        setNewMessage(e.target.value)
        if(!socket)return;
        if(!typing){
            setTyping(true);
            socket.emit("typing",chatId);
        }
        let lastTypingTime= new Date().getTime();
        var timerLength= 3000;
        setTimeout(()=>{
             var timeNow= new Date().getTime();
             var timeDiff= timeNow- lastTypingTime;

             if(timeDiff>= timerLength && typing){
                socket.emit("stop typing",chatId);
                setTyping(false);
             }
        },timerLength);
    }

    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.on("typing",()=>setIsTyping(true))
        socket.on("stop typing",()=>setIsTyping(false))
        return () => {
            socket.off("typing");
            socket.off("stop typing");
        };
    },[socket])


    useEffect(()=>{
        if(!socket){
            return;
        }
        const messageReceivedHandler =(newMessageRecieved)=>{
            if(chatId!==newMessageRecieved.chat._id.toString()){
                addUnreadChat(newMessageRecieved.chat._id);
            }else{
                setMessageList((prevMessages) => [...prevMessages, newMessageRecieved])
                markChatAsRead(chatId); 
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userData?.data?.token}`,
                    }
                }
                axios.put(`https://incendia-api.onrender.com/messages/markasread/${chatId}`, {}, config)
            }
        }

        socket.on("message received",messageReceivedHandler);

        return () => {
            socket.off("message received", messageReceivedHandler);
        };
    },[socket, chatId, addUnreadChat, markChatAsRead, userData])

    useEffect(()=>{
        fetchMessageHandler();
    },[chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    return(<>
    <div className="h-full border-2 overflow-y-scroll overflow-x-hidden  border-stone-300 relative bg-[url('https://img.freepik.com/premium-photo/gradient-background-design-ad-design_558873-56813.jpg?w=826')]  bg-center bg-cover bg-no-repeat rounded-lg shadow-lg mb-2 flex flex-col scrollbar-hide::-webkit-scrollbar scrollbar-hide">
    <div className='sticky w-full top-0 bg-blue-100 rounded-lg flex gap-1 shadow-md items-center justify-between'>
        <div className='flex items-center'>
        <div> 
        <Link to={`/profile/${props?.chatname}`}>
                <img src={avatar} alt="" className=" mx-2 my-2 h-9 w-9 rounded-full ring-2 "/>
        </Link>
        </div>
        <div className=''>
            <p className='font-bold m-1 text-base '>{username}</p>
        </div>
        </div>
        <div className=' block lg:hidden'>
        <CloseIcon className=" m-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(-1) }} />
        </div>

    </div>
    <div className='flex flex-col flex-1 p-2 overflow-y-scroll flex-grow scrollbar-hide::-webkit-scrollbar scrollbar-hide'>
       { messageList.map((messages,i)=>{
        return(
            <MessageText key={messages._id} content={messages?.content} senderid={messages?.sender}/>
        )})}
        <div ref={messagesEndRef} />
    </div>
    {isTyping? <div className='ml-4 text-purple-950 italic '> Typing....</div> :<></>}
    <div className=" ml-2 m-1 flex gap-2 w-full bottom-0 sticky items-center ">
        <textarea name="Message" value={newMessage} className='shadow-xl pl-2 rounded-lg w-[93%]' placeholder="Type a message..." onChange={typeHandler}  onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                createMessageHandler();
                            }
                        }}/>
        <SendIcon className={`cursor-pointer mr-2`} onClick={createMessageHandler}/>
    </div>
    </div>
    </>);
}

export default MessageChatArea;