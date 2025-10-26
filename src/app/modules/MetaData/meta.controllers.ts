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
  const result = await VendorMetaServices.getAllAdminMetaDataFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Admin Meta Data are retrieved successfully",
    data: result,
  });
});

const getHomePageImages = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.getHomePageImages();
  sendResponse(res, {
    statusCode: status.OK,
    message: "Image are retrieved successfully",
    data: result,
  });
});

const sliderImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.sliderImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Slider Images are Updated successfully",
    data: result,
  });
});
const heroImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.heroImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Hero Images are Updated successfully",
    data: result,
  });
});
const hotDealImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.hotDealImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Hot Deal Images are Updated successfully",
    data: result,
  });
});
const hotMainImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.hotMainImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Hot Main Images are Updated successfully",
    data: result,
  });
});
const reviewImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.reviewImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Review Images are Updated successfully",
    data: result,
  });
});
const reviewMainImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.reviewMainImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Review Main Images are Updated successfully",
    data: result,
  });
});
const footerImagesUpdate = catchAsync(async (req, res) => {
  const result = await VendorMetaServices.footerImagesUpdate(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Footer Images are Updated successfully",
    data: result,
  });
});

export const VendorMetaControllers = {
  getMyVendorMetaDataFromDB,
  getAllAdminMetaDataFromDB,
  getHomePageImages,
  sliderImagesUpdate,
  heroImagesUpdate,hotDealImagesUpdate,hotMainImagesUpdate,reviewImagesUpdate,reviewMainImagesUpdate,footerImagesUpdate
};
