import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { CartServices } from "./cart.services";
import { JwtPayload } from "jsonwebtoken";

const createDataIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await CartServices.createDataIntoDB(
    user as JwtPayload,
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is created successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await CartServices.getAllDataFromDB(user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart are retrieved successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await CartServices.getByIdFromDB(user as JwtPayload, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await CartServices.updateByIdIntoDB(
    user as JwtPayload,
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await CartServices.deleteByIdFromDB(user as JwtPayload, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is deleted successfully",
    data: result,
  });
});

export const CartControllers = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
