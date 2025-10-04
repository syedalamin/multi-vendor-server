import { Request } from "express";

const sendImagesToCPanel = async (req: Request) => {
  let fileUrls: string[] = [];

  if (req.files && Array.isArray(req.files)) {
    fileUrls = await Promise.all(
      req.files.map(
        (file: Express.Multer.File) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      )
    );
  }

 
  return fileUrls;
};

export default sendImagesToCPanel;
