import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});
// Server-side upload using the Cloudinary SDK
const uploadToCloudinary = async (file: File) => {
  try {
    // For Cloudinary SDK, we need a file path or a buffer
    // Since we have a File object, we need to get its buffer/data
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      // Using the upload_stream API to upload from buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" }, // Optional: organize uploads in folders
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      // Convert buffer to stream and pipe to uploadStream
      const Readable = require("stream").Readable;
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};
export { uploadToCloudinary };
