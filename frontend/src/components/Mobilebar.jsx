import { Link } from "react-router-dom";
import { useState } from 'react';
const Mobilemenu=()=>{
    
   const userData= JSON.parse(localStorage.getItem("userData"));
    const [isopen, setIsopen]= useState(false);
    return(
    <div className="md:hidden ">
    <div className="flex flex-col gap-[4.5px] cursor-pointer " onClick={()=>{
        setIsopen(!isopen);
    }}>
        <div className={`w-6 h-1 bg-purple-900 rounded-sm ${isopen? "rotate-45":""} 
        origin-left ease-in-out duration-500`}></div>
         <div className={`w-6 h-1 bg-purple-900 rounded-sm ${isopen? "opacity-0":""} 
        origin-left ease-in-out duration-500`}></div>
         <div className={`w-6 h-1 bg-purple-900 rounded-sm ${isopen? "-rotate-45":""} 
        origin-left ease-in-out duration-500`}></div>
    </div>
    {isopen && (<div className="absolute left-0 top-24 w-full flex h-calc[(100vh-96px)] bg-white flex-col items-center justify-center gap-5 font-medium text-xl z-10">
       
        <Link to="/home" className="mt-2">Home</Link>
        <Link to="">Friends</Link>
        <Link to="">Groups</Link>
        <Link to="/home">Stories</Link>
        <Link to={`/profile/${userData?.data?.username}`} className="mb-2"><div className="flex items-center gap-4 xl:gap-8 justify-end ">
        <img src={userData?.data?.avatar} alt=""  className="w-10 h-10 rounded-full ring-2 "/>
        </div></Link>
    </div>
    )}
    </div>
    );
}
export default Mobilemenu;