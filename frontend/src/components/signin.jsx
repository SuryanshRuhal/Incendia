import { useState } from "react";
import img from "./logosignin.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';

const Signin = () => {
    const [contact, setContact] = useState({
        fname: "",
        lname: "",
        username: "",
        email: "",
        password: "",
    });
    const [signin, setsignin] = useState(true);
    const [password, setPassword] = useState(true);
    const [loading, setloading] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const navigate = useNavigate();

    const handleclick = () => {
        setPassword(!password);
    }
    const changelogin = () => {
        setsignin(!signin);
        setResetPassword(false); 
    }
    const changeTo = (event) => {
        const { name, value } = event.target;

        setContact(prevValue => {
            return {
                ...prevValue,
                [name]: value,
            };
        })
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "https://incendia-api.onrender.com/user/signin",
                contact,
                config
            );
            localStorage.setItem("userData", JSON.stringify(response));
            window.dispatchEvent(new Event("storage"));
            setloading(false);
            navigate("/home");
            fetchUnreadChats(response.data);
        } catch (error) {
            setloading(false);
        }
    }
    const fetchUnreadChats = async (userData) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const response = await axios.get(`https://incendia-api.onrender.com/messages/unread`, config);
            console.log("unread", response.data);
          
        } catch (error) {
            console.log("Error fetching unread chats:", error);
        }
    };
    const registerHandler = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }

            const response = await axios.post(
                "https://incendia-api.onrender.com/user/register",
                contact,
                config
            );
            localStorage.setItem("userData", JSON.stringify(response));
            window.dispatchEvent(new Event("storage"));
            setloading(false);
            navigate("/profileInfo");
        } catch (error) {
            setloading(false);
        }
    }

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }
            console.log(contact.email);
            console.log(contact.password);
            const response = await axios.post(
                "https://incendia-api.onrender.com/user/reset-password",
                { email: contact.email, newPassword: contact.password }, 
                config
            );
            setloading(false);
            alert("Password reset successful!");
            setResetPassword(false); 
        } catch (error) {
            setloading(false);
        }
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
            <div className="flex h-[100vh] items-center justify-center">
                <div className="bg-[url('https://i.pinimg.com/564x/87/55/8e/87558e16529b6a963a1d338b3ffefc58.jpg')] bg-center bg-cover bg-no-repeat flex w-[75%] items-center justify-center border-4 border-purple-800">
                    <div className="hidden md:block m-4 ml-8 w-1/4 h-max items-center justify-center ">
                        <img src={img} alt="" className="aspect-[6/7] h-max w-full rounded-[50%]" />
                    </div>
                    <div className="flex flex-col w-3/4 items-center justify-center flex-1">
                        <p className="m-4 font-serif text-pink-500">Welcome {contact.fname} {contact.lname}</p>
                        {resetPassword ? (
                            // Reset Password Form
                            <form className="m-2 flex-col w-[90%] flex items-center justify-center">
                                <input type="email" name="email" value={contact.email} placeholder="Email" onChange={changeTo} className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                <div className="flex w-[85%] ">
                                <input name="password" type={password ? "password" : 'text'} value={contact.password} placeholder="New Password" onChange={changeTo} className="w-full mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                <div className="flex m-2 items-center sm:m-1">
                                    {password ? (<VisibilitySharpIcon onClick={handleclick} />) :
                                        (<VisibilityOffSharpIcon onClick={handleclick} />)
                                    }
                                </div>
                                </div>
                                <button className="w-[50%] mt-2 p-2 bg-[rgb(85,2,47)] text-pink-100 cursor-pointer rounded-lg" onClick={resetPasswordHandler}>Reset Password</button>
                            </form>
                        ) : (
                            <form className="m-2 flex-col w-[90%] flex items-center justify-center">
                                {(!signin) ? (
                                    <>
                                        <input type="text" name="fname" value={contact.fname} placeholder="Name" onChange={changeTo} className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                        <input type="text" name="lname" value={contact.lname} placeholder="Last Name" onChange={changeTo} className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                        <input type="text" name="username" value={contact.username} placeholder="Username" onChange={changeTo} className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                        <input type="email" name="email" value={contact.email} placeholder="Email" onChange={changeTo} className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                    </>
                                ) : (
                                    <input type="email" name="email" value={contact.email} placeholder="Email" onChange={changeTo} className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                )}
                                <div className="flex w-[85%] ">
                                    <input name="password" type={password ? "password" : 'text'} value={contact.password} placeholder="Password" onChange={changeTo} className="w-full mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800" />
                                    <div className="flex m-2 items-center sm:m-1">
                                        {password ? (<VisibilitySharpIcon onClick={handleclick} />) :
                                            (<VisibilityOffSharpIcon onClick={handleclick} />)
                                        }
                                    </div>
                                </div>
                                <button className="w-[50%] mt-2 p-2 bg-[rgb(85,2,47)] text-pink-100 cursor-pointer rounded-lg" onClick={signin ? loginHandler : registerHandler}>{signin ? "Sign-In" : "Sign-Up "}</button>
                            </form>
                        )}
                         { resetPassword ?
                         <div className="text-center text-sm text-purple-800 mb-6 mt-2">
                                    <span onClick={changelogin} className="cursor-pointer px-4 py-1 rounded-lg bg-fuchsia-100 text-pink-500">Back to Login</span>
                            </div>:
                            signin ? (
                                <div className="text-center text-sm text-purple-800 mb-6 mt-2">
                                    <span onClick={() => setResetPassword(true)} className="cursor-pointer px-3 py-1 mx-2 rounded-lg bg-fuchsia-100 text-pink-500">Forgot Password?</span>
                                    <span onClick={changelogin} className="cursor-pointer px-3 py-1 rounded-lg bg-fuchsia-100 text-pink-500">Sign-Up</span>
                                </div>
                            ) : (
                                <div className="text-center text-sm text-purple-800 mb-6 mt-2">
                                    <span onClick={changelogin} className="cursor-pointer px-4 py-1 rounded-lg bg-fuchsia-100 text-pink-500">Sign-In</span>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signin;
