import { Response } from "express";

type jsonResponse<T> = {
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T | null | undefined;
};

const sendResponse = <T>(res: Response, jsonResponse: jsonResponse<T>) => {
  res.status(jsonResponse.statusCode).json({
    success: true,
    message: jsonResponse.message,
    meta: jsonResponse.meta || null || undefined,
    data: jsonResponse.data,
  });
};
export default sendResponse;
