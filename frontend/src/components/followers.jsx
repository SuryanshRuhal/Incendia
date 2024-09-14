import axios from "axios";
import { Backdrop, CircularProgress, } from "@mui/material";
import { useEffect, useState } from "react";
import SuggestedlistItem from "./suggesteduserlistitem";
import { useParams } from "react-router-dom";

const FollowerUser= ()=>{
    const [followerList, setFollowerList]= useState([]);
    const[loading, setLoading]= useState(false);
    const {username}= useParams();
    const userData= JSON.parse(localStorage.getItem("userData"));
    const fetchFollowerList= async()=>{
        setLoading(true);
       try {
        const config={
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${userData?.data?.token}`,
            }
        }
        const response= await axios.get(`http://localhost:8080/user/fetchFollowers/${username}`,config);
        setFollowerList(response?.data?.followers);
       } catch (error) {
        console.log(error.message);
       } finally{
        setLoading(false);
       }
    }
    useEffect(()=>{
        fetchFollowerList();
    },[]);

    return(<div>
         <div className="p-2 mt-4 bg-white rounded-lg gap-4 shadow-md  text-sm ">
            <div className="pb-4 px-4 mt-4  flex gap-4 justify-between text-sm ">
                <span className="font-medium">Followers</span>
            </div>
            {loading?
             <Backdrop
             sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
             open={loading}>
             <CircularProgress color="secondary" />
             </Backdrop>
            : followerList.map((suggestedUser,index)=>{
                return <SuggestedlistItem key={index} suggestedUser={suggestedUser}/>
            })}
        </div>
    </div>);
}
export default FollowerUser;