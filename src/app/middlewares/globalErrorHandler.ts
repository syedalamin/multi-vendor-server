import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/share/apiError";

const globalErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let success = false;
  let message = err.message || "Something Went Wrong";
  let name = err.name;
  let stack = err.stack;
  res.status(statusCode).json({
    success,
    message,
    err,
    error: {
      name,
      stack,
    },
  });
};


export default globalErrorHandler