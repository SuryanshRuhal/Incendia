const multer= require("multer") ;
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const compressImage = async (req, res, next) => {
    if (!req.file) return next(); 
    if (req.file.mimetype.startsWith('image/')) {

    try {
      const compressedImageBuffer= await sharp(req.file.buffer)
      .resize(800)
      .jpeg({quality:70})
      .toBuffer()
      
      req.file.buffer= compressedImageBuffer;
    } catch (error) {
      console.error("Error compressing image:", error);
      return next(error);
    }
  }
    next();
  };
  

module.exports = { upload, compressImage};