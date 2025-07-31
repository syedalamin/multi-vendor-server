import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { UserServices } from "./user.services";
import pick from "../../../utils/search/pick";
import { userFilterableFields } from "./user.constants";
import { paginationFilterableField } from "../../../utils/pagination/pagination";

const createAdmin = catchAsync(async (req, res) => {
  const data = await UserServices.createAdmin(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Admin Created Successfully",
    data: data,
  });
});

const createVendor = catchAsync(async (req, res) => {
  const data = await UserServices.createVendor(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Shop Created Successfully",
    data: data,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const data = await UserServices.createCustomer(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Customer Created Successfully",
    data: data,
  });
});

const getAllUserFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationFilterableField);
  const result = await UserServices.getAllUserFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Users are retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Users is retrieved Successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserServices.getMyProfile(user);
  sendResponse(res, {
    statusCode: status.OK,
    message: "My Profile is retrieved Successfully",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserServices.updateMyProfile(req, user);
  sendResponse(res, {
    statusCode: status.OK,
    message: "My Profile is Update Successfully",
    data: result,
  });
});
const changeUserStatus = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.changeUserStatus(email);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Status Change Successfully",
    data: result,
  });
});
const updateUserRole = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.updateUserRole(email, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Update Status Successfully",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createCustomer,
  getAllUserFromDB,
  getByIdFromDB,
  getMyProfile,
  updateMyProfile,
  changeUserStatus,
  updateUserRole,
  createVendor
};
