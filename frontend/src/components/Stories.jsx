import axios from "axios";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { useState, useRef, useEffect } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Stories = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [storiesList, setStoriesList] = useState([]);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const handleAddIconClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        await createStoryHandler(selectedFile);
    };

    const createStoryHandler = async (file) => {
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
            console.log("Uploaded File URL:", cloudinaryUrl);

            const Storyload = {
                storyurl: cloudinaryUrl,
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            };
            await axios.post(`https://incendia-api.vercel.app/stories/create`, Storyload, config);

            fileInputRef.current.value = null;
            setFile(null);
            alert("Story uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload the Story. Please try again.");
        } finally {
            setLoading(false);
        }

    }
    const fetchStoryCreaterHandler = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const response = await axios.get(`https://incendia-api.vercel.app/stories/fetchstorycreator`, config);

            setStoriesList(response?.data);

        } catch (error) {
            console.log("Fetching Story Creaters Failed")
        }
    }
    useEffect(() => {
        fetchStoryCreaterHandler();
    }, []);

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
                <div className="flex gap-8 w-max">
                    <div className=" flex flex-col items-center gap-2 cursor-pointer relative">
                        <Link to={`/story/${userData?.data?._id}`}>
                            <img src={userData?.data?.avatar} alt="" className="w-20 h-20 rounded-full ring-2" />
                        </Link>
                        <span className="font-medium">{userData?.data?.username}</span>
                        <AddIcon className="!text-3xl p-1 bg-violet-200 cursor-pointer rounded-[50%] absolute left-1/1 top-[60%] " onClick={handleAddIconClick} />
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    </div>
                    {storiesList.map((storyitem, ind) => {
                        return <div className=" flex flex-col items-center gap-2 cursor-pointer " key={ind}>
                            <Link to={`/story/${storyitem._id}`}>
                                <img src={storyitem.avatar} alt="" className="w-20 h-20 rounded-full ring-2" />
                            </Link>
                            <span className="font-medium">{storyitem.username}</span>
                        </div>
                    })}
                </div>
            </div>
        </>
    );
}
export default Stories;