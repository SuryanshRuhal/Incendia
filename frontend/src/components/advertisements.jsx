import { Link } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const Advertisement = ({ companyname, profilepic, productimg, productdesc, weblink }) => {
    return (
        <div className="flex-col p-6 my-4 bg-white rounded-lg flex gap-4 shadow-md justify-between text-sm">
            {/* User */}
            <div className="flex items-center justify-between">
                <span> Sponsered Ads</span>
                <MoreHorizIcon className="cursor-pointer" />
            </div>
            {/* Description */}
            <div className="flex mt-4 flex-col gap-4">
                <div className="w-full min-h-24 relative">
                    <img src={productimg} alt="" fill className=" object-cover rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                    <img src={profilepic} alt="" className="w-7 h-7 rounded-full" />
                    <span className="font-medium text-purple-400 ">{companyname}</span>
                </div>
                <p>{productdesc}</p>
                <div className="flex items-center justify-center gap-4">
                    <button className="bg-purple-200 w-full border-purple-950 py-1 px-2 justify-center shadow-md rounded-md text-xs  cursor-pointer"> <Link to={weblink}>Visit Website</Link></button>
                </div>
            </div>
        </div>
    );
}
export default Advertisement;