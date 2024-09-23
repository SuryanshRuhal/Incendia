import { Link } from "react-router-dom";

const Profilecard = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-2 bg-white flex flex-col rounded-lg gap-4 shadow-md  text-sm">
            <div className="h-20 relative">
                <img src={userData?.data?.avatar} alt="" className=" h-full w-full rounded-md object-cover" />
                <img src={userData?.data?.avatar} alt="" className="rounded-full object-cover h-12 w-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10 " />
            </div>
            <div className="flex my-4 flex-col h-20 mb-6 gap-2 items-center ">
                <span className="font-semibold">{userData?.data?.fname + " " + userData?.data?.lname}</span>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center ">
                        <span className="font-medium">  {userData?.data?.followers?.length} </span>
                        <span className="text-xs text text-gray-500"> Followers </span>
                    </div>
                    <div className="flex flex-col items-center ">
                        <span className="font-medium"> {userData?.data?.following?.length} </span>
                        <span className="text-xs text text-gray-500"> Following </span>
                    </div>
                </div>
                <button className="bg-purple-200 text-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-xs  cursor-pointer"> <Link to={`/profile/${userData?.data?.username}`}> MY Profile </Link> </button>
            </div>
        </div>
    );
}

export default Profilecard;