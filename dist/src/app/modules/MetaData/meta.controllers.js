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
    const user = req.user;
    const result = yield meta_services_1.VendorMetaServices.getAllAdminMetaDataFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Admin Meta Data are retrieved successfully",
        data: result,
    });
}));
exports.VendorMetaControllers = {
    getMyVendorMetaDataFromDB,
    getAllAdminMetaDataFromDB
};
