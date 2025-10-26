"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorMetaControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/share/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const meta_services_1 = require("./meta.services");
const getMyVendorMetaDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield meta_services_1.VendorMetaServices.getMyVendorMetaDataFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "My Meta Data are retrieved successfully",
        data: result,
    });
}));
const getAllAdminMetaDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield meta_services_1.VendorMetaServices.getAllAdminMetaDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Admin Meta Data are retrieved successfully",
        data: result,
    });
}));
const getHomePageImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield meta_services_1.VendorMetaServices.getHomePageImages();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Image are retrieved successfully",
        data: result,
    });
}));
const createHomePageImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield meta_services_1.VendorMetaServices.createHomePageImages(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Images are Updated successfully",
        data: result,
    });
}));
// const sliderImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.sliderImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Slider Images are Updated successfully",
//     data: result,
//   });
// });
// const heroImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.heroImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Hero Images are Updated successfully",
//     data: result,
//   });
// });
// const hotDealImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.hotDealImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Hot Deal Images are Updated successfully",
//     data: result,
//   });
// });
// const hotMainImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.hotMainImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Hot Main Images are Updated successfully",
//     data: result,
//   });
// });
// const reviewImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.reviewImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Review Images are Updated successfully",
//     data: result,
//   });
// });
// const reviewMainImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.reviewMainImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Review Main Images are Updated successfully",
//     data: result,
//   });
// });
// const footerImagesUpdate = catchAsync(async (req, res) => {
//   const result = await VendorMetaServices.footerImagesUpdate(req);
//   sendResponse(res, {
//     statusCode: status.OK,
//     message: "Footer Images are Updated successfully",
//     data: result,
//   });
// });
exports.VendorMetaControllers = {
    getMyVendorMetaDataFromDB,
    getAllAdminMetaDataFromDB,
    getHomePageImages,
    createHomePageImages,
};
