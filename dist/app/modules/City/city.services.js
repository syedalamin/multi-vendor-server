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
exports.CityServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const createCityIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, districtId } = req.body;
    if (!districtId) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "districtId is required");
    }
    const isExistsName = yield prisma_1.default.city.findFirst({
        where: {
            name,
            districtId,
        },
    });
    if (isExistsName) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, "City already exists in this district");
    }
    const result = yield prisma_1.default.city.create({
        data: {
            name,
            districtId,
        },
    });
    return result;
});
const getAllCityFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield prisma_1.default.city.findMany({});
    return results;
});
const getCityByDistrictIdFromDB = (districtId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.city.findMany({
        where: {
            districtId,
        },
    });
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.city.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateByIdIntoDB = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, districtId } = req.body;
    if (!districtId) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "districtId is required");
    }
    const isExistsCity = yield prisma_1.default.city.findFirst({
        where: {
            id: id,
            districtId: districtId,
        },
    });
    const result = yield prisma_1.default.city.update({
        where: {
            id: isExistsCity === null || isExistsCity === void 0 ? void 0 : isExistsCity.id,
            districtId: isExistsCity === null || isExistsCity === void 0 ? void 0 : isExistsCity.districtId,
        },
        data: {
            name,
        },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistsCity = yield prisma_1.default.city.findUnique({
        where: {
            id,
        },
    });
    if (!isExistsCity) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "District is not found");
    }
    const result = yield prisma_1.default.city.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.CityServices = {
    createCityIntoDB,
    getAllCityFromDB,
    getByIdFromDB,
    deleteByIdFromDB,
    updateByIdIntoDB,
    getCityByDistrictIdFromDB
};
