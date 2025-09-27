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
exports.ProductControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../utils/pagination/pagination");
const pick_1 = __importDefault(require("../../../utils/search/pick"));
const catchAsync_1 = __importDefault(require("../../../utils/share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/share/sendResponse"));
const product_constant_1 = require("./product.constant");
const product_services_1 = require("./product.services");
const createDataIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.createDataIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product is created successfully",
        data: result,
    });
}));
const getAllDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterAbleField);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFilterableField);
    const result = yield product_services_1.ProductServices.getAllDataFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getAllMyDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterAbleField);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFilterableField);
    const result = yield product_services_1.ProductServices.getAllMyDataFromDB(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Vendor Product are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getBySlugFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.getBySlugFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product is retrieved successfully",
        data: result,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product is retrieved successfully",
        data: result,
    });
}));
const getByIdsFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.getByIdsFromDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product are retrieved successfully",
        data: result,
    });
}));
const updateByIdIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.updateByIdIntoDB(id, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product is updated successfully",
        data: result,
    });
}));
const softDeleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.softDeleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product Status Changed successfully",
        data: result,
    });
}));
const relatedProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.relatedProducts(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Related Products are retrieved successfully",
        data: result,
    });
}));
exports.ProductControllers = {
    createDataIntoDB,
    getAllDataFromDB,
    getBySlugFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
    softDeleteByIdFromDB,
    relatedProducts,
    getByIdsFromDB,
    getAllMyDataFromDB
};
