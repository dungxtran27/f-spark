import { PassThrough } from "stream";
import cloudinary from "./cloudinary.js";

export const uploadImage = async (file) => {
  if (!file || !file.buffer) {
    console.error("Invalid file data");
    return;
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Upload Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
  }
};
