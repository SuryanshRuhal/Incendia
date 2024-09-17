const multer= require("multer") ;
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const ffmpegPath = require("ffmpeg-static"); 
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

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

  const compressVideoFunction = (inputBuffer) => {
    return new Promise((resolve, reject) => {
      const inputPath = path.join(__dirname, 'tempVideo.mp4');
      const outputPath = path.join(__dirname, 'compressedVideo.mp4');
  
      fs.writeFileSync(inputPath, inputBuffer);
  
      const command = `ffmpeg -i ${inputPath} -vcodec libx264 -crf 28 ${outputPath}`;
  
      exec(command, (error) => {
        if (error) {
          console.error("Error compressing video:", error);
          fs.unlinkSync(inputPath); 
          return reject(error);
        }
  
        const compressedBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(inputPath); 
        fs.unlinkSync(outputPath); 
        resolve(compressedBuffer);
      });
    });
  };
  
  const compressVideo = async (req, res, next) => {
    if (!req.file) return next();
    if (req.file.mimetype.startsWith('video/')) {
      try {
        const compressedVideoBuffer = await compressVideoFunction(req.file.buffer);
        req.file.buffer = compressedVideoBuffer;
      } catch (error) {
        return next(error);
      }
    }
    next();
  };

  const compressMedia = async (req, res, next) => {
    if (!req.file) return next();
    
    if (req.file.mimetype.startsWith('image/')) {
      await compressImage(req, res, next);
    } else if (req.file.mimetype.startsWith('video/')) {
      await compressVideo(req, res, next);
    } else {
      next(); 
    }
  };

module.exports = { upload, compressMedia};