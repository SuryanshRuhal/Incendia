import DoneIcon from '@mui/icons-material/Done';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
const Followrequest=()=>{
    const userData= JSON.parse(localStorage.getItem("userData"));
    const [requestList, setRequestList] = useState([]);
    const [loading, setLoading]= useState(false);
    
    const requestListHandler= async()=>{
        try {
            const config= {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:` Bearer ${userData?.data?.token}`
                }
            }
            const requests=await axios.get(`http://localhost:8080/user/fetchfollowrequests`,config); 
            setRequestList(requests.data.followrequests || []);
            
        } catch (error) {
            console.log(error.message);
        } 
    }
    const acceptRequestHandler= async(userId)=>{
        setLoading(true);
        try {
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            await axios.get(`http://localhost:8080/user/acceptrequest/${userId}`,config);

        } catch (error) {
            console.log(error.message);
        } finally{
            setLoading(false);
        }
    }

    const RejectRequestHandler= async(userId)=>{
        setLoading(true);
        try {
            const config={
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.data?.token}`
                }
            }
            await axios.get(`http://localhost:8080/user/rejectrequest/${userId}`,config);

        } catch (error) {
            console.log(error.message);
        } finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        requestListHandler();
    },[requestList]);

    return(
        <div className="p-2 bg-white rounded-lg gap-4 shadow-md  text-sm ">
            <div className="pb-4 px-4 mt-4  flex gap-4 justify-between text-sm ">
                <span className="font-medium">Follow Requests</span>
                <span className="font-xs text-gray-400 "> See All</span>
            </div>
            {(requestList.length===0)?<div className='m-2 text-center italic'>Sorry, No Requests 🥺</div>:
            requestList.map((request,index)=>{
                return <div className=" m-2 flex items-center justify-between" key={index} >
                <div className="flex items-center gap-4">
                <img src={request.avatar} alt=""  className="w-10 h-10 rounded-full"/>
                <span className="font-medium">{request.username}</span>
                </div>
                <div className='gap-4'>
                    <DoneIcon className='mr-2 cursor-pointer' onClick={()=>{acceptRequestHandler(request._id)}} />
                    <CancelIcon className='ml-2 cursor-pointer' onClick={()=>{RejectRequestHandler(request._id)}} />
                </div>
            </div>
            })}
            
        </div>
        
    );
}
export default Followrequest;