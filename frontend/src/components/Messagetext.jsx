const MessageText= (props)=>{
    const userData= JSON.parse(localStorage.getItem("userData"));
    return (
        <div className={`shadow-xl rounded-lg p-2 m-2 w-fit h-fit max-w-[78%]  ${props?.senderid===userData?.data?._id? " bg-blue-100 ml-auto " :" bg-pink-100 mr-auto"}`}>
            <p className="text-xs">{props?.content}</p>
        </div>
    );
}
export default MessageText;