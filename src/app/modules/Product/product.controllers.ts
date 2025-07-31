import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { ProductServices } from "./product.services";
import { paginationFilterableField } from "../../../utils/pagination/pagination";
import pick from "../../../utils/search/pick";
import { productFilterAbleField } from "./product.constant";

const createDataIntoDB = catchAsync(async (req, res) => {
  const result = await ProductServices.createDataIntoDB(req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is created successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterAbleField);
  const options = pick(req.query, paginationFilterableField);
  const result = await ProductServices.getAllDataFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.updateByIdIntoDB(id, req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Product is updated successfully",
    data: result,
  });
});
const softDeleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.softDeleteByIdFromDB(id);

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
  softDeleteByIdFromDB,
};
