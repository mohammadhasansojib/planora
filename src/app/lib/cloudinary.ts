import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import config from "../config/index.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (
  buffer: Buffer,
  resourceType: "image" = "image"
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        resource_type: resourceType,
      },
      (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }
          
          resolve(result);
      }
    );

    stream.end(buffer);
  });
};

export default cloudinary;