import { useRef } from "react";

 
const getFileType = (url) => {
    if(!url) return "";
    const extension= url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogg'];
   if(imageExtensions.includes(extension)){
    return "image";
   }else if(videoExtensions.includes(extension)){
    return "video";
   }
}

const MessageText= (props)=>{
    const userData= JSON.parse(localStorage.getItem("userData"));
    const fileType=  getFileType(props?.attachMedia);
    const videoRef= useRef(null); 

    return (
        <div className={`shadow-xl rounded-lg p-2 m-2 w-fit h-fit max-w-[78%]  ${props?.senderid===userData?.data?._id? " bg-blue-100 ml-auto " :" bg-pink-100 mr-auto"}`}>
          
            {
                props?.attachMedia &&
                <div className="w-full relative">
                {fileType === 'image' && (
                        <img src={props?.attachMedia} alt="Post media" className="object-cover rounded-md  max-h-80 mb-2" />
                    )}
                  {fileType === 'video' && (
                        <video  ref={videoRef} muted playsInline controls className="object-cover  max-h-80 rounded-md w-full mb-2">
                            <source src={props?.attachMedia} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )} 
                </div>  
            }
              <p className="text-xs">{props?.content}</p>
        </div>
    );
}
export default MessageText;