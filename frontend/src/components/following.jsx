import axios from "axios";
import { Backdrop, CircularProgress, Input, } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SuggestedlistItem from "./suggesteduserlistitem";
import { useParams } from "react-router-dom";

const FollowingUser = ({sh,size, posturl}) => {
    const [followingList, setFollowingList] = useState([]);
    const [searchFollowing,setSearchFollowing]= useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUser,setSelectedUser]= useState(new Set());
    const { username } = useParams();
    const userData = JSON.parse(localStorage.getItem("userData"));

    
    const fetchFollowingList = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const user= username|| userData?.data?.username
            const response = await axios.get(`https://incendia-api.onrender.com/user/fetchFollowing/${user}`, config);
            setFollowingList(response?.data?.following||[]);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }
    const handleSelect=(id)=>{
        setSelectedUser((prevSelUser)=>{
            const updatedSet= new Set(prevSelUser);
            if(!selectedUser.has(id)){
                updatedSet.add(id);
            }else{
                updatedSet.delete(id);
            }
            return updatedSet;
        })
    }

    const sendPostHandler=async()=>{
        setLoading(true);
       try {
        const recipients=[...selectedUser]
        const data={
            mediaUrl:posturl,
            recipients:recipients,
        }
        const config={
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${userData?.data?.token}`,
            }
        }
        const response= await axios.post(`https://incendia-api.onrender.com/messages/sendPostToMultiple`,data,config);
        setSelectedUser(new Set());
       } catch (error) {
        console.log(error.message);
       } finally{
        setLoading(false);
       }
    }
    const filteredfollowing= useMemo(()=>{
        return followingList?.filter(following=> 
           following?.username?.toLowerCase().includes(searchFollowing?.toLowerCase())
    ).slice(0,9)
    },[followingList, searchFollowing]);

    useEffect(() => {
        fetchFollowingList();
    }, []);

    return (<div>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}>
            <CircularProgress color="secondary" />
        </Backdrop>
        {sh!=="sh" && <div className="p-2 mt-4 bg-white rounded-lg gap-4 shadow-md  text-sm ">
            <div className="pb-4 px-4 mt-4  flex gap-4 justify-between text-sm ">
                <span className="font-medium">Following</span>
            </div>
            {followingList.map((suggestedUser, index) => {
                return <SuggestedlistItem key={index} suggestedUser={suggestedUser} />
            })}
        </div>}
        {sh==="sh" && <div>
            <div className="flex justify-center items-center mb-4">
            <Input name="searchfollowing" placeholder="Search following User" value={searchFollowing} onChange={(e)=>{setSearchFollowing(e.target.value)}}
             className={`${size === 'lg' ? '!placeholder:text-base ' : '!placeholder:text-xs '} `}
            />
            <style jsx>{`input::placeholder {font-size: ${size === 'lg' ? '' : 'text-xs'};}`}</style>
            </div>
            <div className={`${size==="sm"?"!gap-3 ":""} flex flex-wrap gap-7 justify-between y-between items-center`}>
            {filteredfollowing.map((suggestedUser, index) => {
                return <div key={index} className={`${size==="sm"? "!w-[20%]" : ""} flex flex-col justify-center items-center w-[25%] cursor-pointer`}>
                    <img src={suggestedUser?.avatar} className={`${size==="sm"? "!w-10 !h-10" :"" } w-16 h-16 rounded-full ring-2 ${selectedUser.has(suggestedUser?._id)? " ring-4 ring-pink-600 ":" "}`} onClick={()=>{handleSelect(suggestedUser?._id)}}/>
                    <span className={`${size==="sm"?" !text-[0.45rem] ": ""}text-gray-900 text-center text-xs truncate block w-full `}>{suggestedUser?.username}</span>
                    </div>
            })}
            </div>
            <div className="flex justify-center items-center mt-4">
           {(selectedUser.size!==0) && <button className=" bg-purple-200 min-w-[20%] border-2 border-purple-500 text-purple-950 py-1 px-2 shadow-md rounded-md text-xs  cursor-pointer" onClick={sendPostHandler}> Send </button>
            }
           </div>
            </div>}
    </div>);
}
export default FollowingUser;