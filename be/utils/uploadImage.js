import { PassThrough } from "stream";
import cloudinary from "./cloudinary.js";

export const uploadImage = async (file) => {
  if (!file) {
    console.error("Invalid file data");
    return;
  }

  try {
    //  base64
    if (typeof file === "string" && file.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(file, {
        resource_type: "image",
      });
      return result.secure_url;
    }

    // buffer
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

      if (file.buffer) {
        const bufferStream = new PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      } else {
        reject("File buffer is required.");
      }
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    return null;
  }
};
