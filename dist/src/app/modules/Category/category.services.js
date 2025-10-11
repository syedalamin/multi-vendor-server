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
exports.CategoryServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const generateSlug_1 = require("../../../utils/slug/generateSlug");
const pagination_1 = require("../../../utils/pagination/pagination");
const buildSortCondition_1 = require("../../../utils/search/buildSortCondition");
const buildSearchAndFilterCondition_1 = require("../../../utils/search/buildSearchAndFilterCondition");
const sendCPanel_1 = __importDefault(require("../../../utils/sendCPanel"));
const deleteImageFromCPanel_1 = __importDefault(require("../../../utils/deleteImageFromCPanel"));
const createCategoryIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const isExistsName = yield prisma_1.default.category.findFirst({
        where: {
            name: name,
            isDeleted: false,
        },
    });
    if (isExistsName) {
        throw new apiError_1.default(http_status_1.default.FOUND, "Category is already exists");
    }
    if (req.file) {
        const fileUrl = (0, sendCPanel_1.default)(req);
        req.body.image = fileUrl;
    }
    if (!req.body.image) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Upload a category picture");
    }
    const slug = (0, generateSlug_1.generateSlug)(name);
    const categoryData = {
        name,
        slug,
        image: req.body.image,
    };
    const result = yield prisma_1.default.category.create({ data: categoryData });
    return result;
});
const getAllCategoryFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, ["name"], pagination_1.allowedSortOrder);
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, ["name"]);
    const results = yield prisma_1.default.category.findMany({
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
        include: {
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    categoryId: true,
                    isDeleted: true,
                    slug: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.category.count({
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
const getBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findFirstOrThrow({
        where: {
            slug,
            isDeleted: false,
        },
        include: {
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,
                    categoryId: true,
                    isDeleted: true,
                },
            },
        },
    });
    return result;
});
const updateByIdIntoDB = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    if (name) {
        const isExistsName = yield prisma_1.default.category.findFirst({
            where: {
                name: name,
                NOT: {
                    id: id,
                },
            },
        });
        if (isExistsName) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "Category is already exists");
        }
    }
    const isExistsCategory = yield prisma_1.default.category.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!isExistsCategory) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Category is not found");
    }
    const categoryData = {};
    if (name) {
        categoryData.name = name;
        categoryData.slug = (0, generateSlug_1.generateSlug)(name);
    }
    if (req.file) {
        yield (0, deleteImageFromCPanel_1.default)(req.body.image);
        const fileUrl = (0, sendCPanel_1.default)(req);
        categoryData.image = fileUrl;
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id: isExistsCategory.id,
        },
        data: categoryData,
    });
    return result;
});
const softDeleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistsCategory = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    isDeleted: true,
                },
            },
        },
    });
    if (!isExistsCategory) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Category is not found");
    }
    const isExistsSubCategoryIds = isExistsCategory.subCategory.map((category) => category.id);
    const isCategoryDeleted = isExistsCategory.isDeleted ? false : true;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const categoryDelete = yield transactionClient.category.update({
            where: {
                id: isExistsCategory.id,
            },
            data: {
                isDeleted: isCategoryDeleted,
            },
            select: {
                name: true,
                isDeleted: true,
            },
        });
        let subCategoryDeleted;
        if (isExistsSubCategoryIds) {
            subCategoryDeleted = yield transactionClient.subCategory.updateMany({
                where: {
                    id: {
                        in: isExistsSubCategoryIds,
                    },
                },
                data: {
                    isDeleted: isCategoryDeleted,
                },
            });
        }
        return Object.assign(Object.assign({}, categoryDelete), subCategoryDeleted);
    }));
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistsCategory = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    isDeleted: true,
                },
            },
        },
    });
    if (!isExistsCategory) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Category is not found");
    }
    const isExistsSubCategoryIds = isExistsCategory.subCategory.map((category) => category.id);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        let subCategoryDeleted;
        if (isExistsSubCategoryIds) {
            subCategoryDeleted = yield transactionClient.subCategory.deleteMany({
                where: {
                    id: {
                        in: isExistsSubCategoryIds,
                    },
                },
            });
        }
        const categoryDelete = yield transactionClient.category.delete({
            where: {
                id: isExistsCategory.id,
            },
            select: {
                name: true,
            },
        });
        return Object.assign(Object.assign({}, categoryDelete), subCategoryDeleted);
    }));
    return result;
});
exports.CategoryServices = {
    createCategoryIntoDB,
    getAllCategoryFromDB,
    getBySlugFromDB,
    updateByIdIntoDB,
    deleteByIdFromDB,
    softDeleteByIdFromDB,
};
