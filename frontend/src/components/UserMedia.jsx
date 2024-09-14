
const UserMedia=({postImages})=>{
    return(
        <div className=" p-2 bg-white rounded-lg gap-4 shadow-lg text-sm">
            <div className="pb-4  px-4 mt-4  flex gap-4 justify-between text-sm ">
                <span className="font-medium">User Media</span>
                <span className="font-xs text-gray-400 cursor-pointer "> See All</span>
            </div>
            <div className="flex p-2 gap-4 justify- flex-wrap">
               { 
               postImages.map((postimg,index)=>{
                return (<div className="relative w-1/2.7 " key={index}>
                <img src={postimg} alt=""  className=" h-32 object-cover rounded-md "/>
                </div>);
               })}
            </div>
        </div>
    );
}
export default UserMedia;