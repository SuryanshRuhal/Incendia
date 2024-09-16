import { Link } from "react-router-dom";
import Mobilemenu from "./Mobilebar";
import img from "./logonav.png";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";

const Navbar = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [searchbar, setSearchBar] = useState("");

    return (
        <div className="h-20 flex items-center justify-between ">
            <div className="md:hidden lg:block w-[20%]">
                <img src={img} alt="" className="h-12 rounded-md  " />
            </div>
            <div className="hidden md:flex w-[50%] ">
                <div className="flex gap-6 ">
                    <Link to="/home" className="flex items-center gap-2">
                        <HomeIcon />
                        <span>Home</span>
                    </Link>
                    <Link to="/home" className="flex items-center gap-2">
                        <Diversity3Icon />
                        <span>Friends</span>
                    </Link>
                    <Link to="/home" className="flex items-center gap-2">
                        <AddCircleOutlineIcon />
                        <span>Stories</span>
                    </Link>
                </div>
            </div>

            <div className=" flex items-center gap-2 sm:gap-4 xl:gap-8 justify-end ">
                <div className="flex gap-2 justify-center items-center ">
                    <input type="text" name="searchbar" value={searchbar} placeholder="Search User" onChange={(e) => { setSearchBar(e.target.value) }} className="w-[65%] sm:w-[100%] mb-1 rounded-lg p-0 sm:p-1 text-purple-950  bg-slate-50 border-b-2 shadow-sm border-purple-800 " ></input>
                    <Link to={`/profile/${searchbar}`}>
                        <SearchIcon className="!h-6 !w-6 sm:!h-7 sm:!w-7 ml-1 cursor-pointer self-end" />
                    </Link>
                </div>
                <Mobilemenu />
            </div>
            <div className="hidden md:flex w-[30%] items-center gap-4 xl:gap-8 justify-end ">
                <img src={userData?.data?.avatar} alt="" className="w-12 h-12 rounded-full ring-2 " />
            </div>
        </div>
    );
}

export default Navbar;