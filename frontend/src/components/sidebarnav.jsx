import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';

const SidebarNav=()=>{
    const userData= JSON.parse(localStorage.getItem("userData"));
    return(
        <div className="p-2 bg-white rounded-lg  shadow-md text-sm">
        <Link to="/home">
        <div className="flex items-center gap-4 mx-4 my-8">
        <HomeIcon className="!h-9 !w-9 cursor-pointer"/>
        <span className="font-medium text-base text-purple-400 "> Home </span>
        </div>
        </Link>
        <Link to={`/profile/${userData?.data?.username}`}>
        <div className="flex items-center gap-4 mx-4 my-8">
        <img src={userData?.data?.avatar} alt=""  className="w-9 h-9 cursor-pointer rounded-full"/>
        <span className="font-medium text-base text-purple-400 "> Profile</span>
        </div>
        </Link>
        <Link to="/activity">
        <div className="flex items-center gap-4 mx-4 my-8">
        <FavoriteBorderIcon className="!h-9 !w-9 cursor-pointer self-end"/>
        <span className="font-medium text-base text-purple-400 "> Activity </span>
        </div>
        </Link>
        <Link to="/">
        <div className="flex items-center gap-4 mx-4 my-8">
        <NotificationsIcon className="!h-9 !w-9 cursor-pointer self-end"/>
        <span className="font-medium text-base text-purple-400 "> Notification </span>
        </div>
        </Link>
        <Link to="/">
        <div className="flex items-center gap-4 mx-4 my-8">
        <SearchIcon className="!h-9 !w-9 cursor-pointer self-end"/>
        <span className="font-medium text-base text-purple-400 "> Search </span>
        </div>
        </Link>
        <Link to="/explore">
        <div className="flex items-center gap-4 mx-4 my-8">
        <ExploreIcon className="!h-9 !w-9 cursor-pointer self-end"/>
        <span className="font-medium text-base text-purple-400 "> Explore </span>
        </div>
        </Link>
    </div>
    );

}
export default SidebarNav;