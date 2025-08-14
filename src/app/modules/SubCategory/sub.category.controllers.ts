import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { SubCategoryServices } from "./sub.category.services";
import pick from "../../../utils/search/pick";
import { paginationFilterableField } from "../../../utils/pagination/pagination";

const createSubCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await SubCategoryServices.createSubCategoryIntoDB(req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Sub Category is created successfully",
    data: result,
  });
});
const getAllSubCategoryFromDB = catchAsync(async (req, res) => {
   const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, paginationFilterableField);
  const result = await SubCategoryServices.getAllSubCategoryFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Sub Category are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubCategoryServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Sub Category is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubCategoryServices.updateByIdIntoDB(req, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Sub Category is updated successfully",
    data: result,
  });
});
const softDeleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubCategoryServices.softDeleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Sub Category soft deleted successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubCategoryServices.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Sub Category is deleted successfully",
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategoryIntoDB,
  getAllSubCategoryFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  softDeleteByIdFromDB,
  deleteByIdFromDB,
};
