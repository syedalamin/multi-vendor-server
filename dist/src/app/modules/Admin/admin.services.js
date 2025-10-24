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
exports.AdminServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const admin_constants_1 = require("./admin.constants");
const pagination_1 = require("../../../utils/pagination/pagination");
const buildSearchAndFilterCondition_1 = require("../../../utils/search/buildSearchAndFilterCondition");
const buildSortCondition_1 = require("../../../utils/search/buildSortCondition");
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const sendCPanel_1 = __importDefault(require("../../../utils/sendCPanel"));
const getAllAdmins = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, pagination_1.allowedAdminSortFields, pagination_1.allowedSortOrder);
    // search
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, admin_constants_1.adminSearchAbleFields, true);
    // console.log(searchTerm, filterData)
    const results = yield prisma_1.default.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.admin.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.admin.findFirstOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
});
const updateByIdFrmDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(id, req.body, req.file);
    const isUserExist = yield prisma_1.default.admin.findFirstOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    if (!isUserExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    if (req.file) {
        const fileUrl = (0, sendCPanel_1.default)(req);
        req.body.profilePhoto = fileUrl;
    }
    const result = yield prisma_1.default.admin.update({
        where: {
            id: id,
        },
        data: req.body,
    });
    return result;
});
const softDeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const adminExist = yield prisma_1.default.admin.findFirstOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!adminExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Admin is not found");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        yield transactionClient.user.update({
            where: {
                email: adminDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.BLOCKED,
            },
        });
        return adminDeletedData;
    }));
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const adminExist = yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    if (!adminExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Admin is not found");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.delete({
            where: {
                id,
            },
        });
        yield transactionClient.user.delete({
            where: {
                email: adminDeletedData.email,
            },
        });
        return adminDeletedData;
    }));
    return result;
});
exports.AdminServices = {
    getAllAdmins,
    getByIdFromDB,
    updateByIdFrmDB,
    softDeleteFromDB,
    deleteFromDB,
};
