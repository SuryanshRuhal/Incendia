import Addpost from "./Addpost";
import Feed from "./Feed";
import Leftmenu from "./leftmenu";
import Rightmenu from "./rightmenu";
import Stories from "./Stories";


const Homepage=()=>{
    return(
        <div className="flex gap-6 pt-6">
            <div className="hidden xl:block w-[20%]">
                <Leftmenu/>
            </div>
            <div className="w-full lg:w-[70%] xl:w-[50%] ">
               <div className="mx-4 my-2 sm:m-0 flex flex-col pt-6">
               <Stories/>
                <Addpost/>
                <Feed size="lg"/>
               </div>
            </div>
            <div className="hidden lg:block w-[30%]">
            <Rightmenu/>
            </div>
        </div>
    );
}
export default Homepage;