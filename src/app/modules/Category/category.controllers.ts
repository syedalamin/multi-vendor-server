import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { CategoryServices } from "./category.services";
import pick from "../../../utils/search/pick";
import { paginationFilterableField } from "../../../utils/pagination/pagination";

const createCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategoryIntoDB(req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is created successfully",
    data: result,
  });
});
const getAllCategoryFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, paginationFilterableField);
  const result = await CategoryServices.getAllCategoryFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category are retrieved successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.updateByIdIntoDB(req, id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is updated successfully",
    data: result,
  });
});
const softDeleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.softDeleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is deleted successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  softDeleteByIdFromDB,
  deleteByIdFromDB,
};
