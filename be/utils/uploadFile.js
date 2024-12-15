import { PassThrough } from "stream";
import cloudinary from "./cloudinary.js";

export const uploadFile = async (file, fileName) => {
  if (!file) {
    console.error("Invalid file data");
    return;
  }

  try {
    // Base64
    if (typeof file === "string" && file.startsWith("data:")) {
      const result = await cloudinary.uploader.upload(file, {
        resource_type: "raw",
        public_id: fileName, // Set the public ID to the file name
      });
      return result.secure_url;
    }

    // Buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: fileName, // Set the public ID to the file name
        },
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
