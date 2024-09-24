import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { Backdrop, CircularProgress, } from "@mui/material";
import debounce from "lodash/debounce";
import { v4 as uuidv4 } from "uuid";

const Feed = ({ size }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const isFetchingRef = useRef(false);
    const skipRef = useRef(0);
    const limit = 4;

    const fetchfeed = async () => {
        if (loading || isFetchingRef.current) { return; }
        setLoading(true);
        isFetchingRef.current = true;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData.data.token}`,
                }
            }
            const response = await axios.get(`https://incendia-api.vercel.app/post?limit=${limit}&skip=${skipRef.current}`, config);
            if (response.data.length === 0) {
                skipRef.current = 0;
                return;
            }
            const postsWithUniqueKeys = response.data.map((post) => ({
                ...post,
                uniqueKey: uuidv4(),
            }));
            setPosts(
                (prevPosts) => [
                    ...prevPosts,
                    ...postsWithUniqueKeys
                ]
            );

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }

    useEffect(() => {
        fetchfeed();
    }, []);

    const hadleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            fetchfeed();
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', hadleScroll);
        return () => {
            window.removeEventListener("scroll", hadleScroll);
        }
    }, []);

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className=" ">
                {
                    posts.map((postitem, index) => {
                        return <Post key={postitem.uniqueKey} id={postitem._id} postedby={postitem.postedby} size={size}
                            likedby={postitem.likedby} postimg={postitem.postimg} caption={postitem.caption}
                            createdAt={postitem.createdAt} updatedAt={postitem.updatedAt} commentno={postitem?.comments?.length} />
                    })
                }
            </div>
        </>
    );
}

export default Feed;