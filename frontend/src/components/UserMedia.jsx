const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase(); 
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogg'];
    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    }
}

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
               const fileType = getFileType(postimg);
                return (
                <div className="relative w-1/2.7 " key={index}>
                {fileType === 'image' && (
                        <img src={postimg} alt="Post media" className="object-cover h-32 rounded-md" />
                    )}
                  {fileType === 'video' && (
                        <video controls className="object-cover rounded-md h-32">
                            <source src={postimg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )} 
                </div>);
               })}
            </div>
        </div>
    );
}
export default UserMedia;