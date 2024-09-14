const multer= require("multer") ;
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../uploads')
    },
    filename: function (req, file, cb) {

      cb(null,`image-${Date.now()}.${file.originalname}`);
    }
  })

  const upload = multer({ storage });

  const compressImage = async (req, res, next) => {
    if (!req.file) return next(); 
    const filePath = req.file.path; 
    const compressedFilePath = path.resolve('../uploads', `compressed-${Date.now()}.jpg`); // Correct path resolution
  
    try {
    
      await sharp(filePath)
        .resize(800) 
        .jpeg({ quality: 70 }) 
        .toFile(compressedFilePath);
  
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting original file:", err);
        }
      });
  
      
      req.file.path = compressedFilePath;
      req.file.filename = path.basename(compressedFilePath);
  
      next();
    } catch (error) {
      console.error("Error compressing image:", error);
      next(error);
    }
  };
  

module.exports = { upload, compressImage};