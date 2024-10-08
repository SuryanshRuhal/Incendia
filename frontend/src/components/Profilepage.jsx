import { Backdrop, CircularProgress, } from "@mui/material";
import UserInfoCard from "./Userinfocard";
import UserMedia from "./UserMedia";
import Advertisementlist from "./advertisementlist";
import Birthdays from "./Birthdays";
import Followrequest from "./Followrequest";
import SidebarNav from "./sidebarnav";
import Post from "./Post";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import FollowerUser from "./followers";
import FollowingUser from "./following";

const ProfilePage = () => {
    const nav = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [oneUserData, setOneUserData] = useState();
    const [userPosts, setUserPosts] = useState([]);

    const fetperticularUserHandler = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }
            const perticularUser = await axios.get(
                `https://incendia-api.onrender.com/user/find/${username}`,
                config
            );
            setOneUserData(perticularUser?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const fetchUserPostHandler = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`,
                }
            }

            const post = await axios.get(
                `https://incendia-api.onrender.com/post/${username}`,
                config
            );
            setUserPosts([
                ...post?.data,
            ]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetperticularUserHandler();
        fetchUserPostHandler();
    }, [username]);
    const postImages = userPosts.map(post => post.postimg);

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className="flex gap-6 pt-6">
                <div className="hidden xl:block w-[20%]">
                    <div className="flex flex-col gap-6">
                        <SidebarNav />
                        <Advertisementlist limit={1} />
                    </div>
                </div>
                <div className="w-full lg:w-[70%] xl:w-[50%] ">
                    <div className="my-2 sm:m-0 mx-4 flex flex-col pt-6">
                        <div className="p-2 bg-white flex flex-col rounded-lg gap-4 shadow-md  text-sm">
                            <div className="h-20 relative">
                                <img src={oneUserData?.avatar} alt="" className=" h-full w-full rounded-md object-cover" />
                                <img src={oneUserData?.avatar} alt="" className="rounded-full object-cover h-12 w-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-9 " />
                            </div>
                            <div className="flex my-4 flex-col h-20 gap-2 items-center ">
                                <span className="font-semibold"> {oneUserData?.fname + " " + oneUserData?.lname}</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center cursor-pointer ">
                                        <span className="font-medium"> {oneUserData?.posts?.length} </span>
                                        <span className="text-xs text text-gray-500"> Posts </span>
                                    </div>
                                    <div className="flex flex-col items-center cursor-pointer " onClick={() => { nav("followers") }}>
                                        <span className="font-medium"> {oneUserData?.followers?.length} </span>
                                        <span className="text-xs text text-gray-500"> Followers </span>
                                    </div>
                                    <div className="flex flex-col items-center cursor-pointer " onClick={() => { nav("following") }}>
                                        <span className="font-medium"> {oneUserData?.following?.length} </span>
                                        <span className="text-xs text text-gray-500"> Following </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Outlet />
                        {/* {<FollowerUser/>} */}
                        {/* {<FollowingUser/>} */}
                        <div className="sm:hidden my-2 sm:m-0 mx-0 flex flex-col pt-6">
                            <UserInfoCard userInfo={oneUserData} />
                        </div>
                        {
                            userPosts.map((userPostItem, index) => {
                                return <Post key={userPostItem?._id} postedby={userPostItem.postedby} id={userPostItem._id}
                                    postimg={userPostItem.postimg} caption={userPostItem.caption} likedby={userPostItem.likedby}
                                    createdAt={userPostItem.createdAt} updatedAt={userPostItem.updatedAt} commentno={userPostItem?.comments?.length} size="lg" />
                            })
                        }
                    </div>
                </div>
                <div className="hidden lg:block w-[30%]">
                    <div className="flex flex-col gap-6">
                        <UserInfoCard userInfo={oneUserData} />
                        <UserMedia postImages={postImages} />
                        <Followrequest />
                        <Birthdays />
                        <Advertisementlist limit={1} />
                    </div>
                </div>
            </div>
        </>
    );
}
export default ProfilePage;