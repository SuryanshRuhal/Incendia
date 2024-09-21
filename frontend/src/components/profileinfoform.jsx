import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

const ProfileInfo = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = null;

      if (file) {
        const resourceType = file.type.startsWith("video/") ? "video" : "image";
        const uploadPreset = file.type.startsWith("video/") ? "Incendia-video" : "Incendia-image";
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", uploadPreset);
        uploadData.append("resource_type", resourceType);

        const uploadResponse = await axios.post(`https://api.cloudinary.com/v1_1/dp6skj1a4/${resourceType}/upload`, uploadData);
        avatarUrl = uploadResponse.data.secure_url;
      }

      const profileUpdatePayload = {
        living: e.target.living.value,
        bio: e.target.bio.value,
        birthday: e.target.birthday.value,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.data.token}`,
        },
      };

      const response = await axios.post(
        `https://incendia-api.vercel.app/user/profileupdate/${userData.data._id}`,
        profileUpdatePayload,
        config
      );

      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Failed to upload the Story. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="flex h-[100vh] items-center justify-center">
        <div className="bg-[url('https://i.pinimg.com/564x/87/55/8e/87558e16529b6a963a1d338b3ffefc58.jpg')] bg-center bg-cover bg-no-repeat flex flex-col w-[60%] items-center justify-center border-4 border-purple-800">
          <form className="m-2 flex-col w-[90%] flex items-center justify-center" onSubmit={handleProfileUpdate}>
            <input
              type="text"
              name="living"
              placeholder="Living"
              className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800"
            />
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800"
            />
            <input
              type="date"
              name="birthday"
              placeholder="Birthday"
              className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800"
            />
            <label htmlFor="avatar" className="text-xs text-start">
              Profile Pic:
            </label>
            <input
              type="file"
              name="avatar"
              onChange={handleFileChange}
              className="w-[85%] mb-2 rounded-lg p-2 text-purple-950 bg-[#70798121] border-b-2 shadow-2xl border-purple-800"
            />
            <button
              type="submit"
              className="w-[50%] mt-2 p-2 bg-[rgb(85,2,47)] text-pink-100 cursor-pointer rounded-lg"
            >
              Done
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
