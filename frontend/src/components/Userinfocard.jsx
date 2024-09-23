import { useState, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserInfoCard = ({ userInfo }) => {
  const [followStatus, setFollowStatus] = useState({ isFollowing: false, isFollowedBack: false });
  const [requestSent, setRequestSent] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {

    if (userData?.data?.token) {
      const checkFollowStatus = async () => {

        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.data?.token}`,
            },
          };
          const datares = await axios.get(`https://incendia-api.vercel.app/user/checkfollowstatus/${userInfo?._id}`, config);

          setFollowStatus(datares?.data);
        } catch (error) {
          console.error('Error fetching follow status', error);
        }
      };

      checkFollowStatus();
    }
  }, [userInfo?._id, userData?.data?.token]);
  if (!userInfo) {
    return <span>Loading user data...</span>;
  }

  const sendRequestHandler = async () => {
    try {
      setRequestSent(!requestSent);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.data?.token}`,
        },
      };

      await axios.get(`https://incendia-api.vercel.app/user/sendrequestto/${userInfo?._id}`, config);

      setRequestSent(!requestSent);

    } catch (error) {
      setRequestSent(!requestSent);
      console.log(error);
    }
  };

  return (
    <div className="p-2 bg-white rounded-lg gap-4 shadow-lg text-sm">
      <div className="pb-4 px-4 mt-4 flex gap-4 justify-between text-sm">
        <span className="font-medium"></span>
        <span className="text-xs text-red-600 cursor-pointer">Block User</span>
      </div>

      <div className="flex flex-col items-center justify-center">
        <span className="text-xl p-4 text-center">{userInfo?.fname + ' ' + userInfo?.lname}</span>
        <img src={userInfo?.avatar} alt="" className="w-24 h-24 rounded-full" />
        <span className="font-medium text-xl">{'@' + userInfo?.username}</span>
        <p className="p-2 text-center">{userInfo?.bio}</p>
      </div>
      <div className="p-2">
        <CalendarMonthIcon />
        <span className="pl-2 font-medium">
          Birthday <span className="text-gray-400 font-medium">{new Date(userInfo?.birthday).toLocaleDateString('en-GB')}</span>
        </span>
      </div>
      <div className="p-2">
        <LocationOnIcon />
        <span className="pl-2 font-medium">
          Living in <span className="text-gray-400 font-medium">{userInfo?.living}</span>
        </span>
      </div>
      <div className="p-2">
        <CalendarMonthIcon />
        <span className="pl-2 font-medium">
          Joined <span className="text-gray-400 font-medium">{new Date(userInfo?.creationdate).toLocaleDateString('en-GB')}</span>
        </span>
      </div>

      {userInfo?._id === userData?.data?._id ? (
        <Link to="/profileInfo">
          <button className="bg-purple-200 w-full mb-2 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-s cursor-pointer">
            Edit
          </button>
        </Link>
      ) : followStatus.isFollowedBack ? (
        <button className="bg-rose-100 w-full mb-2 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-s cursor-pointer">
          Following
        </button>
      ) : followStatus.isFollowing ? (
        <button className={`${requestSent ? "bg-sky-200" : "bg-purple-200"} w-full mb-2 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-s cursor-pointer`} onClick={sendRequestHandler} disabled={requestSent} >
          {requestSent ? "Request is Sent" : "Follow Back"}
        </button>
      ) : (
        <button className={`${requestSent ? "bg-sky-200" : "bg-purple-200"} w-full mb-2 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-s cursor-pointer`} onClick={sendRequestHandler} disabled={requestSent}>
          {requestSent ? "Request is Sent" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserInfoCard;
