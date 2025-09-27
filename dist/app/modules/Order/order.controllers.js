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
exports.OrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/share/sendResponse"));
const order_services_1 = require("./order.services");
const createDataIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield order_services_1.OrderServices.checkout(user, req.body, "COD");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order is created successfully",
        data: result,
    });
}));
const getAllDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield order_services_1.OrderServices.getAllDataFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order are retrieved successfully",
        data: result,
    });
}));
const getMyVendorDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield order_services_1.OrderServices.getMyVendorDataFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "My Order are retrieved successfully",
        data: result,
    });
}));
const getMyDataFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield order_services_1.OrderServices.getMyDataFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "My Order are retrieved successfully",
        data: result,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.getByIdFromDB(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order is retrieved successfully",
        data: result,
    });
}));
const getByIdsFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { ids } = req.body;
    const result = yield order_services_1.OrderServices.getByIdsFromDB(user, ids);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order are retrieved successfully",
        data: result,
    });
}));
const updateStatusByIdIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.updateStatusByIdIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order is updated successfully",
        data: result,
    });
}));
const updatePaymentStatusByIdIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.updatePaymentStatusByIdIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order payment is update successfully",
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_services_1.OrderServices.deleteByIdFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Order is deleted successfully",
        data: result,
    });
}));
exports.OrderControllers = {
    createDataIntoDB,
    getAllDataFromDB,
    getByIdFromDB,
    getByIdsFromDB,
    updateStatusByIdIntoDB,
    deleteByIdFromDB,
    getMyDataFromDB,
    getMyVendorDataFromDB,
    updatePaymentStatusByIdIntoDB
};
