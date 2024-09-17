import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Backdrop, CircularProgress, } from "@mui/material";

const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase(); 
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogg'];
    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    }
}

const ViewStory = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const {id}= useParams();
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();
    const [story,setStory]= useState(null);
    const fetchUserStory=async()=>{
        try {
            setLoading(true);
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const fetchedStory= await axios.get(`https://incendia-api.vercel.app/stories/fetchstory/${id}`,config);
            
            setStory(fetchedStory?.data);
        } catch (error) {
            console.log("Story not Availabe");
        } finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchUserStory();
    },[])

    
    const fileType = getFileType(story?.stories[0]?.story);
    return (
        <div className="flex justify-center items-center  h-[calc(100vh-64px)]">
           {
            loading?
            <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}>
            <CircularProgress color="secondary" />
        </Backdrop>:
            <div className="w-fit flex-col bg-lime-100 rounded-lg flex shadow-md  h-full relative ">
            <div className="flex mx-4 my-2 items-center justify-between absolute top-0 left-0 right-0">
                <div className="flex items-center gap-4">
                    <img src={story?.avatar} alt="" className="w-12 h-12 rounded-full" />
                    <span className="font-medium">{story?.username}</span>
                </div>
                <CloseIcon className="absolute right-4 top-3 cursor-pointer" onClick={() => navigate(-1)} />
            </div>
            <div className="flex-1 flex items-center justify-center  h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]">
                {fileType === 'image' && (
                        <img src={story?.stories[0]?.story} alt="Post media" className="object-cover hfull w-full" />
                    )}
                  {fileType === 'video' && (
                        <video controls className="object-cover h-full w-full">
                            <source src={story?.stories[0]?.story} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )} 
            </div>
        </div>
           }
        </div>
    );
}
export default ViewStory;