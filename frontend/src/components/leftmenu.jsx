import Profilecard from "./Profilecard";
import SidebarNav from "./sidebarnav";
import Advertisementlist from "./advertisementlist";

const Leftmenu=()=>{
    return(
        <div className="flex flex-col gap-6">
            <Profilecard/>
           <SidebarNav/>
            <Advertisementlist limit={1} />
        </div>
    );
}
export default Leftmenu;