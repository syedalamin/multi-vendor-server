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
exports.SubCategoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/share/sendResponse"));
const sub_category_services_1 = require("./sub.category.services");
const pick_1 = __importDefault(require("../../../utils/search/pick"));
const pagination_1 = require("../../../utils/pagination/pagination");
const createSubCategoryIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sub_category_services_1.SubCategoryServices.createSubCategoryIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Sub Category is created successfully",
        data: result,
    });
}));
const getAllSubCategoryFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ["searchTerm"]);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFilterableField);
    const result = yield sub_category_services_1.SubCategoryServices.getAllSubCategoryFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Sub Category are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getBySlugFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield sub_category_services_1.SubCategoryServices.getBySlugFromDB(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Sub Category is retrieved successfully",
        data: result,
    });
}));
const updateByIdIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield sub_category_services_1.SubCategoryServices.updateByIdIntoDB(req, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Sub Category is updated successfully",
        data: result,
    });
}));
const softDeleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield sub_category_services_1.SubCategoryServices.softDeleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Sub Category soft deleted successfully",
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield sub_category_services_1.SubCategoryServices.deleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Sub Category is deleted successfully",
        data: result,
    });
}));
exports.SubCategoryControllers = {
    createSubCategoryIntoDB,
    getAllSubCategoryFromDB,
    getBySlugFromDB,
    updateByIdIntoDB,
    softDeleteByIdFromDB,
    deleteByIdFromDB,
};
