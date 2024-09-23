import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, } from "@mui/material";


const Birthdays = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [loading, setLoading] = useState(false);
    const [liston, setlist] = useState(false);
    const [birthdayitem, setbirthdayItem] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const fetchBirthdayHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const response = await axios.get(
                `https://incendia-api.vercel.app/user/todaybirthday`, config
            );
            setbirthdayItem(response?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUpcomingBirthdayHandler = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            const response = await axios.get(
                `https://incendia-api.vercel.app/user/upcomingbirthdays`, config
            )
            setUpcomingBirthdays(response?.data);

        } catch (error) {
            console.log(error.message);
        }

    }
    useEffect(() => {
        fetchBirthdayHandler();
        fetchUpcomingBirthdayHandler();
    }, [])
    return (
        <div className="p-2 bg-white rounded-lg gap-4 shadow-md  text-sm ">
            <div className="pb-4 px-4 mt-4  flex gap-4 justify-between text-sm ">
                <span className="font-medium">Birthdays</span>
                <span className="font-xs text-gray-400 "> See All</span>
            </div>
            {loading ?
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}>
                    <CircularProgress color="secondary" />
                </Backdrop> :
                <>
                    {birthdayitem.length === 0 ?
                        <div className='m-2 text-center italic'>No Birthdays</div> :
                        birthdayitem.map((birthdayman, i) => {
                            return (<div key={birthdayman._id} className=" m-2 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={birthdayman?.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    <span className="font-medium">{birthdayman?.fname + " " + birthdayman?.lname} </span>
                                </div>
                                <div className='gap-4'>
                                    <button className="bg-purple-200 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-xs "> Congratulate </button>
                                </div>
                            </div>);
                        })
                    }
                </>}
            <div className="flex m-2 p-2 items-center justify-between  bg-gray-300 rounded-md">
                <div className="flex items-center gap-4">
                    <CardGiftcardIcon />
                    <span className="font-medium">Upcoming Birthdays</span>
                </div>
                <span className="font-xs text-gray-400 cursor-pointer " onClick={() => { setlist(!liston) }}> View</span>

            </div>
            {!liston ? "" :
                <>
                    {upcomingBirthdays.length === 0 ?
                        <div className='m-2 italic'> No Birthdays</div> :
                        upcomingBirthdays.map((upcomingbirthdayman, i) => {
                            return (<div key={upcomingbirthdayman._id} className=" m-2 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={upcomingbirthdayman?.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    <span className="font-medium">{upcomingbirthdayman?.fname + " " + upcomingbirthdayman?.lname} </span>
                                </div>
                                <div className='gap-4'>
                                    <button className="bg-purple-200 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-xs "> {new Date(upcomingbirthdayman?.birthday).toLocaleDateString('en-GB')} </button>
                                </div>
                            </div>);
                        })
                    }
                </>
            }
        </div>
    );
}
export default Birthdays;