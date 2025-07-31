import { NextFunction, Request, Response } from "express";
import status from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API Is not found",
    error: {
      path: req.path,
      message: "Your Request Path is not found",
    },
  });
};


export default notFound;