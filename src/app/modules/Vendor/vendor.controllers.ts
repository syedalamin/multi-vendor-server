import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { VendorServices } from "./vendor.services";
import pick from "../../../utils/search/pick";
import { vendorFilterableFields } from "./vendor.constant";
import { paginationFilterableField } from "../../../utils/pagination/pagination";


const getAllDataFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, vendorFilterableFields);
    const options = pick(req.query, paginationFilterableField);
  
  const result = await VendorServices.getAllDataFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Vendor are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await VendorServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Vendor is retrieved successfully",
    data: result,
  });
});
const verifyUpdateByIdIntoDB = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await VendorServices.verifyUpdateByIdIntoDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Vendor Status is Updated successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await VendorServices.updateByIdIntoDB(id, req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Vendor is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const {id} = req.params
  const result = await VendorServices.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Vendor is deleted successfully",
    data: result,
  });
});
const softDeleteByIdFromDB = catchAsync(async (req, res) => {
  const {id} = req.params
  const result = await VendorServices.softDeleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Vendor is deleted successfully",
    data: result,
  });
});

export const VendorControllers = {

  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
  verifyUpdateByIdIntoDB,
  softDeleteByIdFromDB
};
