import { ZodError } from "zod";
import { TErrors, TGenericErrorResponse } from "../../../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrors = err?.issues?.map((issue) => {
    return {
      path: issue?.path?.join("."),
      message: issue?.message,
    };
  });
  console.log(errorSources)
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errors: errorSources,
  };
};

export default handleZodError;
