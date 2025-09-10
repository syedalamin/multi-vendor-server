import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { DistrictServices } from "./district.services";

const createDistrictIntoDB = catchAsync(async (req, res) => {
  const result = await DistrictServices.createDistrictIntoDB(req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "District is created successfully",
    data: result,
  });
});

const getAllDistrictFromDB = catchAsync(async (req, res) => {
  const result = await DistrictServices.getAllDistrictFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "District are retrieved successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DistrictServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "District is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DistrictServices.updateByIdIntoDB(req, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "District is updated successfully",
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DistrictServices.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "District is deleted successfully",
    data: result,
  });
});

export const DistrictControllers = {
  createDistrictIntoDB,
  getAllDistrictFromDB,
  deleteByIdFromDB,
  getByIdFromDB,
  updateByIdIntoDB
  
};
