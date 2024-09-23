import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PollIcon from '@mui/icons-material/Poll';
import MovieIcon from '@mui/icons-material/Movie';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Backdrop, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";

const Addpost = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handlePostCreate = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        setLoading(true);
        try {

            const resourceType = file.type.startsWith("video/") ? "video" : "image";
            const uploadPreset = file.type.startsWith("video/") ? "Incendia-video" : "Incendia-image";
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            formData.append("resource_type", resourceType);

            const uploadResponse = await axios.post(`https://api.cloudinary.com/v1_1/dp6skj1a4/${resourceType}/upload`, formData);

            const cloudinaryUrl = uploadResponse.data.secure_url;

            const postPayload = {
                caption: caption,
                postimg: cloudinaryUrl,
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            };

            await axios.post(`https://incendia-api.vercel.app/post/create`, postPayload, config);

            fileInputRef.current.value = null;
            setCaption("");
            setFile(null);
            alert("Post uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload the post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    }, [file, caption]);

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className="p-4 my-4 bg-white rounded-lg flex gap-4 shadow-md justify-between text-sm">
                <div className="">
                    <img src={userData?.data?.avatar} alt="" className="w-20 h-20 rounded-full ring-2" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-center items-center">
                        <div className="">
                            <input
                                type="file"
                                accept="image/*, video/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="w-[90%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800"
                            />
                            <input
                                type="text"
                                name="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="What's on your mind?"
                                className="bg-slate-100 w-[90%] mb-2 rounded-lg outline-none flex-1 p-2"
                            />
                        </div>
                        <div className="items-center">
                            <CloudUploadIcon className="!h-14 !w-14 cursor-pointer self-center" onClick={handlePostCreate} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-grey-400 flex-wrap justify-around">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <AddPhotoAlternateIcon />
                            Photo
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <MovieIcon />
                            Video
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <PollIcon />
                            Poll
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <CalendarMonthIcon />
                            Event
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Addpost;
