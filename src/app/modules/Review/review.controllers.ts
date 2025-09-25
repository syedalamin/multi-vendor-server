import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { ReviewServices } from "./review.services";


const createDataIntoDB = catchAsync(async (req, res) => {
   const { id } = req.params;
  const result = await ReviewServices.createDataIntoDB(id, req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Rating is updated successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllDataFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Review are retrieved successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Review are retrieved successfully",
    data: result,
  });
});


const updateByIdIntoDB = catchAsync(async (req, res) => {
  const result = await ReviewServices.updateByIdIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Review is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const result = await ReviewServices.deleteByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Review is deleted successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
