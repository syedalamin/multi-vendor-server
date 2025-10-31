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
exports.VendorServices = void 0;
const client_1 = require("@prisma/client");
const pagination_1 = require("../../../utils/pagination/pagination");
const buildSearchAndFilterCondition_1 = require("../../../utils/search/buildSearchAndFilterCondition");
const buildSortCondition_1 = require("../../../utils/search/buildSortCondition");
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const vendor_constant_1 = require("./vendor.constant");
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const generateSlug_1 = require("../../../utils/slug/generateSlug");
const sendShopImageToCPanel_1 = __importDefault(require("../../../utils/sendShopImageToCPanel"));
const getAllDataFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, vendor_constant_1.allowedVendorSortFields, pagination_1.allowedSortOrder);
    // search
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, vendor_constant_1.vendorSearchAbleFields);
    // console.log(searchTerm, filterData)
    const result = yield prisma_1.default.vendor.findMany({
        where: Object.assign({ isBlocked: false }, whereConditions),
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
    const total = yield prisma_1.default.vendor.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vendor.findFirstOrThrow({
        where: {
            id: id,
            isBlocked: false,
        },
    });
    return result;
});
const getBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vendor.findFirstOrThrow({
        where: {
            shopSlug: slug,
            isBlocked: false,
            isVerified: true,
        },
        include: {
            user: {
                select: {
                    product: {
                        where: {
                            status: {
                                in: [
                                    client_1.ProductStatus.ACTIVE,
                                    client_1.ProductStatus.DISCONTINUED,
                                    client_1.ProductStatus.OUT_OF_STOCK,
                                ],
                            },
                        },
                    },
                },
            },
        },
    });
    return result;
});
const updateByIdIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = req.body;
    const files = req.files;
    const isVendorExist = yield prisma_1.default.vendor.findFirst({
        where: {
            id,
            isBlocked: false,
        },
    });
    if (!isVendorExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Vendor is not found");
    }
    if (vendorData.shopName) {
        const slug = (0, generateSlug_1.generateSlug)(vendorData.shopName);
        const isExistsShopName = yield prisma_1.default.vendor.findUnique({
            where: {
                shopSlug: slug,
                NOT: {
                    id: id,
                },
            },
        });
        if (isExistsShopName) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "Shop name is already exists");
        }
        else {
            vendorData.shopSlug = slug;
        }
    }
    if (req.files) {
        if (files.logo) {
            const imageUrl = (0, sendShopImageToCPanel_1.default)(req);
            const imageString = imageUrl.logo[0];
            vendorData.logo = imageString;
        }
        if (files.banner) {
            const imageUrl = (0, sendShopImageToCPanel_1.default)(req);
            const imageString = imageUrl.banner[0];
            vendorData.banner = imageString;
        }
    }
    const result = yield prisma_1.default.vendor.update({
        where: {
            id: isVendorExist.id,
        },
        data: vendorData,
    });
    return result;
});
const verifyUpdateByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isVendorExist = yield prisma_1.default.vendor.findFirst({
        where: {
            id,
            isBlocked: false,
        },
        include: {
            user: true,
        },
    });
    if (!isVendorExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Vendor is not found");
    }
    const isExistsShopProduct = yield prisma_1.default.product.findMany({
        where: {
            sellerId: isVendorExist.id,
        },
    });
    if (isExistsShopProduct) {
        yield prisma_1.default.product.updateMany({
            where: {
                sellerId: isVendorExist.user.id,
            },
            data: {
                status: client_1.ProductStatus.ACTIVE,
            },
        });
    }
    const result = yield prisma_1.default.vendor.update({
        where: {
            id: isVendorExist.id,
        },
        data: {
            isVerified: true,
        },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isVendorExist = yield prisma_1.default.vendor.findFirst({
        where: {
            id,
        },
    });
    if (!isVendorExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Vendor is not found");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.vendor.delete({
            where: {
                email: isVendorExist.email,
            },
        });
        yield transactionClient.user.delete({
            where: { email: isVendorExist.email },
        });
        return result;
    }));
    return result;
});
const softDeleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isVendorExist = yield prisma_1.default.vendor.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    if (!isVendorExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Vendor is not found");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.product.updateMany({
            where: {
                sellerId: isVendorExist.user.id,
            },
            data: {
                status: client_1.ProductStatus.INACTIVE,
            },
        });
        const result = yield transactionClient.vendor.update({
            where: {
                id: isVendorExist.id,
            },
            data: {
                isVerified: false,
            },
        });
        return result;
    }));
    return result;
});
exports.VendorServices = {
    getAllDataFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
    deleteByIdFromDB,
    verifyUpdateByIdIntoDB,
    softDeleteByIdFromDB,
    getBySlugFromDB,
};
