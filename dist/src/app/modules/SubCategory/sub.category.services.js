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
exports.SubCategoryServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const generateSlug_1 = require("../../../utils/slug/generateSlug");
const client_1 = require("@prisma/client");
const pagination_1 = require("../../../utils/pagination/pagination");
const buildSortCondition_1 = require("../../../utils/search/buildSortCondition");
const buildSearchAndFilterCondition_1 = require("../../../utils/search/buildSearchAndFilterCondition");
const sendCPanel_1 = __importDefault(require("../../../utils/sendCPanel"));
const deleteImageFromCPanel_1 = __importDefault(require("../../../utils/deleteImageFromCPanel"));
const createSubCategoryIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const categoryId = req.body.categoryId;
    const isExistsName = yield prisma_1.default.subCategory.findFirst({
        where: {
            name: name,
            isDeleted: false,
        },
    });
    if (isExistsName) {
        throw new apiError_1.default(http_status_1.default.FOUND, "Sub Category is already exists");
    }
    const isCategoryIdExists = yield prisma_1.default.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    if (!isCategoryIdExists) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Category is not found");
    }
    if (req.file) {
        const fileUrl = (0, sendCPanel_1.default)(req);
        req.body.image = fileUrl;
    }
    if (!req.body.image) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Upload a category picture");
    }
    const slug = (0, generateSlug_1.generateSlug)(name);
    const subCategoryData = {
        name,
        slug,
        image: req.body.image,
        categoryId: isCategoryIdExists.id,
    };
    const result = yield prisma_1.default.subCategory.create({ data: subCategoryData });
    return result;
});
const getAllSubCategoryFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, ["name"], pagination_1.allowedSortOrder);
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, ["name"]);
    const results = yield prisma_1.default.subCategory.findMany({
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
    const total = yield prisma_1.default.subCategory.count({
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
    const result = yield prisma_1.default.subCategory.findFirstOrThrow({
        where: {
            slug,
            isDeleted: false,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,
                },
            },
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
    });
    return result;
});
const updateByIdIntoDB = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, categoryId } = req.body;
    if (name) {
        const isExistsName = yield prisma_1.default.subCategory.findFirst({
            where: {
                name: name,
                NOT: {
                    id: id,
                },
            },
        });
        if (isExistsName) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "Sub Category is already exists");
        }
    }
    const isExistsSubCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!isExistsSubCategory) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Sub Category is not found");
    }
    const subCategoryData = {};
    if (name) {
        subCategoryData.name = name;
        subCategoryData.slug = (0, generateSlug_1.generateSlug)(name);
    }
    if (req.file) {
        yield (0, deleteImageFromCPanel_1.default)(req.body.image);
        const fileUrl = (0, sendCPanel_1.default)(req);
        subCategoryData.image = fileUrl;
    }
    const result = yield prisma_1.default.subCategory.update({
        where: {
            id: isExistsSubCategory.id,
        },
        data: Object.assign(Object.assign({}, subCategoryData), { categoryId }),
    });
    return result;
});
const softDeleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistsSubCategory = yield prisma_1.default.subCategory.findUnique({
        where: {
            id,
        },
    });
    if (!isExistsSubCategory) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Sub Category is not found");
    }
    const newIsDeleted = isExistsSubCategory.isDeleted ? false : true;
    const result = yield prisma_1.default.subCategory.update({
        where: {
            id: isExistsSubCategory.id,
        },
        data: {
            isDeleted: newIsDeleted,
        },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistsSubCategory = yield prisma_1.default.subCategory.findUnique({
        where: {
            id,
        },
    });
    if (!isExistsSubCategory) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Sub Category is not found");
    }
    const result = yield prisma_1.default.subCategory.delete({
        where: {
            id: isExistsSubCategory.id,
        },
    });
    return result;
});
exports.SubCategoryServices = {
    createSubCategoryIntoDB,
    getAllSubCategoryFromDB,
    getBySlugFromDB,
    updateByIdIntoDB,
    softDeleteByIdFromDB,
    deleteByIdFromDB,
};
