import cloudinary from "./cloudinary.js";

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    console.log(result);

    return result.url;
  } catch (error) {
    console.log(error);
  }
};
