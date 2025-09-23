import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { InvoiceServices } from "./invoice.services";
import { JwtPayload } from "jsonwebtoken";


const createDataIntoDB = catchAsync(async (req, res) => {
  const result = await InvoiceServices.createDataIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Invoice is created successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await InvoiceServices.getAllDataFromDB(user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Invoice are retrieved successfully",
    data: result,
  });
});
const getLastDataFromDB = catchAsync(async (req, res) => {
   const user = req.user;
  const result = await InvoiceServices.getLastDataFromDB(user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Invoice is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const result = await InvoiceServices.updateByIdIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Invoice is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const result = await InvoiceServices.deleteByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Invoice is deleted successfully",
    data: result,
  });
});

export const InvoiceControllers = {
  createDataIntoDB,
  getAllDataFromDB,
  getLastDataFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
