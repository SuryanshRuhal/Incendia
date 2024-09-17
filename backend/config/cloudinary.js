const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_APIKEY, 
    api_secret: process.env.CLOUDINARY_APISECRET
});

const uploadOnCloudinary= async (fileBuffer, resourceType='auto')=>{
    try {

        if(!fileBuffer) return null;
         const response= await cloudinary.uploader.upload_stream({
            resource_type: resourceType,
        }).end(fileBuffer);

        return response; 
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
}
module.exports = {uploadOnCloudinary};