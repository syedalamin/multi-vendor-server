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
exports.VendorControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/share/sendResponse"));
const vendor_services_1 = require("./vendor.services");
const pick_1 = __importDefault(require("../../../utils/search/pick"));
const vendor_constant_1 = require("./vendor.constant");
const pagination_1 = require("../../../utils/pagination/pagination");
const getAllDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, vendor_constant_1.vendorFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFilterableField);
    const result = yield vendor_services_1.VendorServices.getAllDataFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield vendor_services_1.VendorServices.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor is retrieved successfully",
        data: result,
    });
}));
const verifyUpdateByIdIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield vendor_services_1.VendorServices.verifyUpdateByIdIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor Status is Updated successfully",
        data: result,
    });
}));
const updateByIdIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield vendor_services_1.VendorServices.updateByIdIntoDB(id, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor is updated successfully",
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield vendor_services_1.VendorServices.deleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor is deleted successfully",
        data: result,
    });
}));
const softDeleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield vendor_services_1.VendorServices.softDeleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor is Blocked successfully",
        data: result,
    });
}));
exports.VendorControllers = {
    getAllDataFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
    deleteByIdFromDB,
    verifyUpdateByIdIntoDB,
    softDeleteByIdFromDB,
};
