import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "../config/config.js";

// Configure cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinaryName,
  api_key: config.cloudinary.cloudinaryApiKey,
  api_secret: config.cloudinary.cloudinaryApiSecret,
});

// Upload file to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "blog",
    });

    // File has been uploaded successfully
    // console.log("File uploaded on cloudinary", response.url);

    // Remove file from local storage
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
