import { NextFunction, Request, Response } from "express";

const formDataParser = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  next();
};

export default formDataParser;
