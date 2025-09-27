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
exports.DistrictServices = void 0;
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const createDistrictIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const isExistsName = yield prisma_1.default.district.findFirst({
        where: {
            name,
        },
    });
    if (isExistsName) {
        throw new apiError_1.default(http_status_1.default.FOUND, "District is already exists");
    }
    const result = yield prisma_1.default.district.create({ data: { name } });
    return result;
});
const getAllDistrictFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield prisma_1.default.district.findMany({
        include: {
            city: true,
        },
    });
    return results;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.district.findUnique({
        where: {
            id,
        },
        include: {
            city: true,
        },
    });
    return result;
});
const updateByIdIntoDB = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const isExistsName = yield prisma_1.default.district.findFirst({
        where: {
            name,
        },
    });
    if (isExistsName) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, "District is already exists");
    }
    const result = yield prisma_1.default.district.update({
        where: {
            id,
        },
        data: { name },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistsDistrict = yield prisma_1.default.district.findUnique({
        where: {
            id,
        },
    });
    if (!isExistsDistrict) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "District is not found");
    }
    const result = yield prisma_1.default.district.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.DistrictServices = {
    createDistrictIntoDB,
    getAllDistrictFromDB,
    deleteByIdFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
};
