import { Outlet, useParams } from "react-router-dom";
import MessageSideArea from "./MessageSidearea";
import MessageChatArea from "./MessageChatArea";

const MessageMaincontainer= ()=>{
    const {chatId}= useParams();
    return(
    <div className="flex gap-4 lg:pt-6 h-[calc(100vh-96px)]">
            <div className={`${chatId!=null?" hidden ":" "} m-2 lg:block w-full lg:w-[30%]`}>
            <MessageSideArea/>
            </div>
            <div className={` ${chatId!=null?" ":" hidden "} m-2 lg:block w-full lg:w-[70%] `}>
            <Outlet/>
            {/*{<MessageChatArea/> }*/}
            </div>
        </div>
    );
}
export default MessageMaincontainer;
