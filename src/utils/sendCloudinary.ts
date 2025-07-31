import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryUploadResponse, IFile } from "../interface/file";
cloudinary.config({
  cloud_name: "dluxn37lw",
  api_key: "667457563465524",
  api_secret: "B8zIPmYg-0gSRbv0x3LOy7QnpkU",
});
const sendImageToCloudinary = async (
  file: IFile
): Promise<ICloudinaryUploadResponse | undefined | unknown> => {
  try {
    const uploadResult = await cloudinary.uploader
      .upload(file.path, {
        public_id: file.filename,
      })
      .catch((error) => {
        console.log(error);
      });

    await fs.promises.unlink(file.path);
    return uploadResult;
  } catch (err) {
    console.log(err);
  }
};

export default sendImageToCloudinary;
