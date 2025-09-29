import { Request } from "express";

const sendToCPanel = (req: Request) => {
 
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    (req.file as Express.Multer.File).filename
  }`;

 
  return fileUrl;
};

export default sendToCPanel;
