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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../utils/pagination/pagination");
const buildSearchAndFilterCondition_1 = require("../../../utils/search/buildSearchAndFilterCondition");
const buildSortCondition_1 = require("../../../utils/search/buildSortCondition");
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const generateSlug_1 = require("../../../utils/slug/generateSlug");
const product_constant_1 = require("./product.constant");
const sendImagesToCPanel_1 = __importDefault(require("../../../utils/sendImagesToCPanel"));
const deleteImagesFromCPanel_1 = __importDefault(require("../../../utils/deleteImagesFromCPanel"));
const createDataIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productData = req.body;
    const isSubCategoryIdExist = yield prisma_1.default.subCategory.findFirst({
        where: {
            id: productData.subCategoryId,
            isDeleted: false,
        },
    });
    if (!isSubCategoryIdExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Sub Category is Not found");
    }
    const isUserExists = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        },
    });
    if (isUserExists) {
        productData.sellerId = isUserExists.id;
    }
    if (req.files && Array.isArray(req.files)) {
        const imageUrl = yield (0, sendImagesToCPanel_1.default)(req);
        productData.productImages = imageUrl;
    }
    productData.slug = (0, generateSlug_1.generateSlug)(productData.name);
    // productData.sku
    const productCount = yield prisma_1.default.product.count({
        where: {
            subCategoryId: isSubCategoryIdExist.id,
        },
    });
    productData.sku = (0, generateSlug_1.generateSku)(isSubCategoryIdExist.name, productCount);
    const result = yield prisma_1.default.product.create({ data: productData });
    return result;
});
const getAllDataFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, product_constant_1.allowedProductSortAbleField, pagination_1.allowedSortOrder);
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, ["name"]);
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            } }),
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
                    name: true,
                    slug: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.product.count({
        where: Object.assign(Object.assign({}, whereConditions), { status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            } }),
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
const getAllMyDataFromDB = (filters, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, product_constant_1.allowedProductSortAbleField, pagination_1.allowedSortOrder);
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, ["name"]);
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            role: client_1.UserRole.VENDOR,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { sellerId: userInfo.id }),
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
                    name: true,
                    slug: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.product.count({
        where: Object.assign(Object.assign({}, whereConditions), { sellerId: userInfo.id }),
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
const getBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findFirstOrThrow({
        where: {
            slug,
            status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            },
        },
        include: {
            subCategory: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    });
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findFirstOrThrow({
        where: {
            id,
        },
        include: {
            subCategory: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    });
    return result;
});
const getByIdsFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("ids must be a non-empty array");
    }
    const result = yield prisma_1.default.product.findMany({
        where: {
            id: { in: ids },
        },
        include: {
            subCategory: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    });
    return result;
});
const updateByIdIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = req.body;
    if (productData.subCategoryId) {
        const isSubCategoryIdExist = yield prisma_1.default.subCategory.findFirst({
            where: {
                id: productData.subCategoryId,
                isDeleted: false,
            },
        });
        if (!isSubCategoryIdExist) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Sub Category is Not found");
        }
    }
    if (productData.name) {
        const isProductExistsByName = yield prisma_1.default.product.findFirst({
            where: {
                name: productData.name,
                NOT: {
                    id: id,
                },
            },
        });
        if (isProductExistsByName) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "Product name is already exists");
        }
        productData.slug = (0, generateSlug_1.generateSlug)(productData.name);
    }
    const existingProduct = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
        },
    });
    if (!existingProduct) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Product is not found");
    }
    let updateImages = existingProduct.productImages || [];
    if (productData.removeImages && Array.isArray(productData.removeImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(productData.removeImages);
        updateImages = updateImages.filter((img) => !productData.removeImages.includes(img));
    }
    if (req.files && Array.isArray(req.files)) {
        const imageUrl = yield (0, sendImagesToCPanel_1.default)(req);
        updateImages = [...updateImages, ...imageUrl];
    }
    if (productData.stock > 0) {
        productData.status = client_1.ProductStatus.ACTIVE;
    }
    else if (productData.stock < 1) {
        productData.status = client_1.ProductStatus.OUT_OF_STOCK;
    }
    const { removeImages } = productData, otherProductData = __rest(productData, ["removeImages"]);
    const updatedData = Object.assign(Object.assign({}, otherProductData), { productImages: updateImages });
    const result = yield prisma_1.default.product.update({
        where: {
            id: existingProduct.id,
        },
        data: updatedData,
    });
    return result;
});
const softDeleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const isStatusDelete = isProductExists.status === client_1.ProductStatus.ACTIVE
        ? client_1.ProductStatus.INACTIVE
        : client_1.ProductStatus.ACTIVE;
    const result = yield prisma_1.default.product.update({
        where: {
            id: isProductExists.id,
        },
        data: {
            status: isStatusDelete,
        },
    });
    return result;
});
const relatedProducts = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            },
        },
    });
    if (!isProductExists) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Product is not found");
    }
    const relatedProducts = yield prisma_1.default.product.findMany({
        where: {
            subCategoryId: isProductExists.subCategoryId,
            NOT: { id: isProductExists.id },
            status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            },
        },
        orderBy: { id: "desc" },
        take: 4,
    });
    return relatedProducts;
});
exports.ProductServices = {
    createDataIntoDB,
    getAllDataFromDB,
    getBySlugFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
    softDeleteByIdFromDB,
    relatedProducts,
    getByIdsFromDB,
    getAllMyDataFromDB,
};
