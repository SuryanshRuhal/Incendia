import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import MessageText from './Messagetext';

const MessageChatArea=(props)=>{
    const userData= JSON.parse(localStorage.getItem("userData"));
    const [newMessage, setNewMessage]= useState("");
    const [messageList, setMessageList]= useState([]);
    const {chatId}= useParams();
    const messagesEndRef = useRef(null);
    const navigate= useNavigate();
    const location = useLocation();
    const {username, avatar}= location.state||{};

    const fetchMessageHandler=async()=>{
        try {
            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization :`Bearer ${userData?.data?.token}`,
                }
            }
            const response= await axios.get(`http://localhost:8080/messages/fetchmessages/${chatId}`, config );
            setMessageList(response?.data);
        } catch (error) {
            console.log(error);
        }
    }
    const createMessageHandler=async()=>{
        try {
            const config={
                headers:{
                   "Content-Type":"application/json",
                   Authorization: `Bearer ${userData?.data?.token}`, 
                }
            }
            const data= {content: newMessage};
            const response= await axios.post(`http://localhost:8080/messages/newmessage/${chatId}`,data,config);
            setMessageList((prevMessages) => [...prevMessages, response.data]);
            setNewMessage("");
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(()=>{
        fetchMessageHandler();
    },[]);

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
    <div className=" ml-2 m-1 flex gap-2 w-full bottom-0 sticky items-center ">
        <textarea name="Message" value={newMessage} className='shadow-xl rounded-lg w-[93%]' placeholder="Type a message..." onChange={(e)=>setNewMessage(e.target.value)}/>
        <SendIcon className={`cursor-pointer mr-2`} onClick={createMessageHandler}/>
    </div>
    </div>
    </>);
}

export default MessageChatArea;