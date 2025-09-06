import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { OrderServices } from "./order.services";
import { JwtPayload } from "jsonwebtoken";

const createDataIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.checkout(
    user as JwtPayload,
    req.body,
    "COD"
  );

  sendResponse(res, {
    statusCode: status.OK,
    message: "Order is created successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.getAllDataFromDB(user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Order are retrieved successfully",
    data: result,
  });
});
const getMyVendorDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.getMyVendorDataFromDB(user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "My Order are retrieved successfully",
    data: result,
  });
});
const getMyDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.getMyDataFromDB(user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "My Order are retrieved successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const {id }= req.params;
  const result = await OrderServices.getByIdFromDB(user as JwtPayload, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Order is retrieved successfully",
    data: result,
  });
});
const updateStatusByIdIntoDB = catchAsync(async (req, res) => {
    const {id }= req.params;
  const result = await OrderServices.updateStatusByIdIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Order is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Order is deleted successfully",
    data: result,
  });
});

export const OrderControllers = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateStatusByIdIntoDB,
  deleteByIdFromDB,
  getMyDataFromDB,
  getMyVendorDataFromDB
  
};
