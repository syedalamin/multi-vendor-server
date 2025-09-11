import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { CityServices } from "./city.services";

const createCityIntoDB = catchAsync(async (req, res) => {
  const result = await CityServices.createCityIntoDB(req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "City is created successfully",
    data: result,
  });
});

const getAllCityFromDB = catchAsync(async (req, res) => {
  const result = await CityServices.getAllCityFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "City are retrieved successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CityServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "City is retrieved successfully",
    data: result,
  });
});
const getCityByDistrictIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CityServices.getCityByDistrictIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "City is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CityServices.updateByIdIntoDB(req, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "City is updated successfully",
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CityServices.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "City is deleted successfully",
    data: result,
  });
});

export const CityControllers = {
  createCityIntoDB,
  getAllCityFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
  getCityByDistrictIdFromDB
};
