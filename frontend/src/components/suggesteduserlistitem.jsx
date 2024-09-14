
import { Link } from "react-router-dom";

const SuggestedlistItem=({suggestedUser})=>{
    return(
        <div className=" m-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
        <Link to={`/profile/${suggestedUser?.username}`}>
        <img src={suggestedUser?.avatar} alt=""  className="w-10 h-10 rounded-full curser-pointer"/>
        </Link> 
        <span className="font-medium">{suggestedUser?.username}</span>
        </div>
        <div className='gap-4'>
        <Link to={`/profile/${suggestedUser?.username}`}>
        <button className="bg-purple-200 w-full mb-2 border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-s cursor-pointer" >
          View Profile
        </button>
        </Link> 
        </div>
        </div>
    )
}
export default SuggestedlistItem;