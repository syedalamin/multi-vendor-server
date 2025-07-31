import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { AdminServices } from "./admin.services";
import pick from "../../../utils/search/pick";
import { adminFilterableFields } from "./admin.constants";
import { paginationFilterableField } from "../../../utils/pagination/pagination";

const getAllAdmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, paginationFilterableField);

  const result = await AdminServices.getAllAdmins(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "All Admin is retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Single Admin is retrieved successfully",
    data: result,
  });
});

const updateByIdFrmDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.updateByIdFrmDB(id, req);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Update Admin  successfully",
    data: result,
  });
});
const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.softDeleteFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Soft Delete Admin  successfully",
    data: result,
  });
});
const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminServices.deleteFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Delete Admin  successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getByIdFromDB,
  updateByIdFrmDB,
  softDeleteFromDB,
  deleteFromDB
};
