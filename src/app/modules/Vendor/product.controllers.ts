import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { ProductServices } from "./product.services";


const createDataIntoDB = catchAsync(async (req, res) => {
  const result = await ProductServices.createDataIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is created successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllDataFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product are retrieved successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const result = await ProductServices.getByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const result = await ProductServices.updateByIdIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is deleted successfully",
    data: result,
  });
});

export const ProductControllers = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
