import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { Backdrop, CircularProgress, } from "@mui/material";

const Feed=({size})=>{
    
const userData = JSON.parse(localStorage.getItem("userData"));
const[posts, setPosts]= useState([]);
const [loading,setLoading]= useState(false);
const skipRef= useRef(0);
const limit=2;

const fetchfeed= async()=>{
    if(loading){return;}
    setLoading(true);
   try {
    
    const config={
        headers:{
            "Content-Type": "applcation/json",
            Authorization: `Bearer ${userData.data.token}`,
        }
    }
    const response= await axios.get(`https://incendia-api.vercel.app/post?limit=${limit}&skip=${skipRef.current}`,config);
    
    if(response.data.length===0){
       skipRef.current=0;
        return;
    }

    setPosts(
        (prevPosts)=>[
            ...prevPosts,
            ...response?.data,
        ]
    );
    skipRef.current += limit;

   } catch (error) {
    console.error(error);
   } finally{
    setLoading(false);
   }
}

useEffect(()=>{
    fetchfeed();
},[]);

const hadleScroll=()=>{
    if(window.innerHeight+ document.documentElement.scrollTop+1>=document.documentElement.scrollHeight){
        fetchfeed();
    }
};
useEffect(()=>{
    window.addEventListener('scroll',hadleScroll);
    return()=>{
        window.removeEventListener("scroll",hadleScroll);
    }
},[]);

    return(
        <div className=" ">
           {
            loading?
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
            :
            posts.map((postitem,index)=>{
                return <Post key={index} id={postitem._id} postedby={postitem.postedby} size={size}
                likedby={postitem.likedby} postimg={postitem.postimg} caption={postitem.caption} 
                createdAt={postitem.createdAt} updatedAt={postitem.updatedAt} commentno={postitem?.comments?.length} />
            })
            }
        </div>
    );
}

export default Feed;