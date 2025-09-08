import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import status from "http-status";
import { VendorMetaServices } from "./meta.services";

const getMyVendorMetaDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await VendorMetaServices.getMyVendorMetaDataFromDB(
    user as JwtPayload
  );

  sendResponse(res, {
    statusCode: status.OK,
    message: "My Meta Data are retrieved successfully",
    data: result,
  });
});
const getAllAdminMetaDataFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await VendorMetaServices.getAllAdminMetaDataFromDB(
  );

  sendResponse(res, {
    statusCode: status.OK,
    message: "Admin Meta Data are retrieved successfully",
    data: result,
  });
});

export const VendorMetaControllers = {
  getMyVendorMetaDataFromDB,
  getAllAdminMetaDataFromDB
};
