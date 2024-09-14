const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_APIKEY, 
    api_secret: process.env.CLOUDINARY_APISECRET
});

const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
         const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"image",
        });
        return response; 
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}
module.exports = {uploadOnCloudinary};