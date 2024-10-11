import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExploreIcon from '@mui/icons-material/Explore';
import Badge from '@mui/material/Badge';
import ChatIcon from '@mui/icons-material/Chat';
import { useState } from 'react';
import { useUnreadCount } from "../contexts/UnreadCountContext";
const Mobilemenu = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const [isopen, setIsopen] = useState(false);
    const {totalUnread}= useUnreadCount();
    return (
        <div className="md:hidden ">
            <div className="flex flex-col gap-[4.5px] cursor-pointer " onClick={() => {
                setIsopen(!isopen);
            }}>
                <div className={`w-6 h-1 bg-purple-900 rounded-sm ${isopen ? "rotate-45" : ""} 
        origin-left ease-in-out duration-500`}></div>
                <div className={`w-6 h-1 bg-purple-900 rounded-sm ${isopen ? "opacity-0" : ""} 
        origin-left ease-in-out duration-500`}></div>
                <div className={`w-6 h-1 bg-purple-900 rounded-sm ${isopen ? "-rotate-45" : ""} 
        origin-left ease-in-out duration-500`}></div>
            </div>
            {isopen && (<div className="absolute left-0 top-20 w-full flex h-calc[(100vh-96px)] bg-rose-50  items-center justify-evenly my-2 gap-3 font-medium text-xl z-10 rounded-md shadow-lg">

                <Link to="/home">
                    <div className="flex items-center m-3 gap-2">
                        <HomeIcon className="!h-8 !w-8 cursor-pointer" />
                    </div>
                </Link>
                <Link to="/activity">
                    <div className="flex items-center m-3 gap-2 ">
                        <FavoriteBorderIcon className="!h-8 !w-8 cursor-pointer self-end" />
                    </div>
                </Link>
                <Link to="/chathome/chatArea">
                    <div className="flex items-center m-3 gap-2 ">
                    <Badge badgeContent={totalUnread} color="secondary">
                        <ChatIcon className="!h-8 !w-8 cursor-pointer self-end" />
                      </Badge>  
                    </div>
                </Link>
                <Link to="/explore">
                    <div className="flex items-center m-3 gap-2 ">
                        <ExploreIcon className="!h-8 !w-8 cursor-pointer self-end" />
                    </div>
                </Link>
                <Link to={`/profile/${userData?.data?.username}`}>
                    <div className="flex items-center m-3 gap-2">
                        <img src={userData?.data?.avatar} alt="" className="w-8 h-8 cursor-pointer rounded-full " />
                    </div>
                </Link>
            </div>
            )}
        </div>
    );
}
export default Mobilemenu;