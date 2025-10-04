import { Request } from "express";

const sendShopImageToCPanel = (req: Request) => {
  let fileUrls: Record<string, string[]> = {};

  if (req.files && typeof req.files === "object") {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    for (const field in files) {
      fileUrls[field] = files[field].map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }
  }

  return fileUrls;
};

export default sendShopImageToCPanel;
