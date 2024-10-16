import { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import Birthdays from "./Birthdays";
import Suggestions from "./suggestions";
import Followrequest from "./Followrequest";
import Leftmenu from "./leftmenu";
import Rightmenu from "./rightmenu";

const ActivityPosts = () => {
    const [posts, setPosts] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const fetchLikedPostsHandler = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }

            const response = await axios.get(`https://incendia-api.onrender.com/post/likedposts/${userData?.data?._id}`, config);
            setPosts(response?.data?.likedposts);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchLikedPostsHandler();
    }, []);

    return (
        <div className="flex gap-6 pt-6">
            <div className="hidden xl:block w-[20%]">
                <Leftmenu />
            </div>
            <div className="w-full lg:w-[70%] xl:w-[50%] ">
                <div className="mx-4 my-2 sm:m-0 flex flex-col pt-6">
                    <div className="lg:hidden my-4 gap-4 mx-0  flex flex-col pt-6">
                        <Followrequest />
                        <Birthdays />
                        <Suggestions />
                    </div>
                    {(posts.length === 0) ? <div className="p-2 bg-white rounded-lg gap-4 shadow-md h-screen text-sm"><div className='m-2 text-center italic'> You haven't liked any Posts yet.🥺</div> </div>:
                    posts.map((postitem, i) => {
                        return <Post key={postitem._id} id={postitem._id} postedby={postitem.postedby} size="lg"
                            likedby={postitem.likedby} postimg={postitem.postimg} caption={postitem.caption}
                            createdAt={postitem.createdAt} updatedAt={postitem.updatedAt} commentno={postitem?.comments} />
                    })}
                </div>
            </div>
            <div className="hidden lg:block w-[30%]">
                <Rightmenu />
            </div>
        </div>
    );
}
export default ActivityPosts;