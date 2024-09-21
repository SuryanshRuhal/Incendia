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
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [fileType, setFileType] = useState(null);

    const fetchUserStory = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const fetchedStory = await axios.get(`http://incendia-api.vercel.app/stories/fetchstory/${id}`, config);
            setStory(fetchedStory?.data);
            setFileType(getFileType(fetchedStory?.data?.stories[0]?.story));
        } catch (error) {
            console.log("Story not Availabe");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUserStory();
    }, [])



    return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            {
                loading ?
                    <Backdrop
                        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}>
                        <CircularProgress color="secondary" />
                    </Backdrop> :
                    <div className="w-fit flex-col bg-black rounded-lg flex shadow-md h-full relative ">
                        <div className="flex mx-4 my-2 items-center justify-between text-white absolute top-0 left-0 right-0">
                            <div className="flex items-center gap-4">
                                <img src={story?.avatar} alt="" className="w-12 h-12 rounded-full" />
                                <span className="font-medium">{story?.username}</span>
                            </div>
                            <CloseIcon style={{ zIndex: 1000 }} className=" right-4 top-3 m-2 text-white hover:bg-gray-700 focus:outline-none bg-black rounded-[50%] cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(-1) }} />
                        </div>
                        <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]">
                            {fileType === 'image' && (
                                <img src={story?.stories[0]?.story} alt="Post media" className="object-cover h-[calc(100vh-64px)] w-full" />
                            )}
                            {fileType === 'video' && (
                                <video controls className="object-cover lg:h-full max-h-[calc(100vh-64px)]  lg:w-full w-full ">
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