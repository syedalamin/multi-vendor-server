import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/share/apiError";
import config from "../../config";
import { ZodError } from "zod";
import handleZodError from "../../utils/share/errors/handleZodError";
import { Prisma } from "@prisma/client";

const globalErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  console.error("🔥 Global Error:", err);
  let statusCode = 500;
  let success = false;
  let message = "Something Went Wrong";
  let errors = [
    {
      path: "",
      message: "Something Went Wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errors = simplifiedError.errors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate value violates unique constraint";
      errors = [{ path: "", message }];
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Foreign key constraint failed";
      errors = [{ path: "", message }];
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = (err.meta?.cause as string) || "Record not found";
      errors = [{ path: String(err.meta?.modelName || ""), message }];
    }
  } else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errors = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success,
    message,
    errors,
    err: config.NODE_ENV === "development" ? err : null,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;

// res.status(statusCode).json({
//   success,
//   message,
//   err,
//   error: {
//     name,
//     stack,
//   },
// });
