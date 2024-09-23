import axios from "axios";
import { Backdrop, CircularProgress, } from "@mui/material";
import { useEffect, useState } from "react";
import SuggestedlistItem from "./suggesteduserlistitem";

const Suggestions = () => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [loading, setLoading] = useState(false);
    const [suggestionCard, setSuggestioncard] = useState([]);
    const limit = 10;
    const fetchsuggestionHandler = async () => {

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const response = await axios.get(`https://incendia-api.vercel.app/user/suggestions?limit=${limit}`, config);
            setSuggestioncard(response?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchsuggestionHandler();
    }, []);
    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className="p-2 bg-white rounded-lg gap-4 shadow-md  text-sm ">
                <div className="pb-4 px-4 mt-4  flex gap-4 justify-between text-sm ">
                    <span className="font-medium">Suggestions</span>
                    <span className="font-xs text-gray-400 " onClick={() => {
                        fetchsuggestionHandler()
                    }}> Refresh</span>
                </div>
                {suggestionCard.map((suggestedUser, index) => {
                    return <SuggestedlistItem key={index} suggestedUser={suggestedUser} />
                })}

            </div>
        </>
    );
}
export default Suggestions;