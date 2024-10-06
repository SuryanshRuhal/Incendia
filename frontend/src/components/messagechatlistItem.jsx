import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Backdrop, CircularProgress, } from "@mui/material";
const ChatListItem = (props) => {
    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const nav= useNavigate();

    const createChatHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "Application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const response = await axios.get(`http://localhost:8080/chats/access/${props.id}`, config);
            if (response.status === 200 ) {
                nav(`chatArea/${response?.data?._id}`,{
                    state: { username:props?.chatname, avatar:props?.avatar}
            });
            } else if (response.status === 201) {
                nav(`chatArea/${response?.data?._id}`);
            }
        } catch (error) {
            if (error.status === 401) {
            alert("Chat Already Exist!");
        }else{
            alert("Chat Creation Failed!")
        }
        } finally {
            setLoading(false);
        }
    }
    return (
        <><Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}>
            <CircularProgress color="secondary" />
         </Backdrop>
            
                <div className=" bg-white rounded-lg my-2 flex gap-2 shadow-md" onClick={createChatHandler}>
                    <div>
                        <Link to={`/profile/${props?.chatname}`}>
                            <img src={props?.avatar} alt="" className=" mx-2 my-2 h-12 w-12 rounded-full ring-2 " />
                        </Link>
                    </div>
                    <Link to={`/chathome/chatArea`}>
                    <div className=" my-2 ml-2"   onClick={createChatHandler}>
                        <p className="font-bold text-sm text-left" >{props?.chatname}</p>
                        <p className=" text-xs text-left" > {props?.latestmessage} </p>
                    </div>
                    </Link>
                </div>
        </>
    );
}
export default ChatListItem;