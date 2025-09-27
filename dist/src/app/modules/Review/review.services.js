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
exports.ReviewServices = void 0;
const library_1 = require("@prisma/client/runtime/library");
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const client_1 = require("@prisma/client");
const createDataIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.body.value > 5) {
        req.body.value = 5;
    }
    if (req.body.value < 0) {
        req.body.value = 0;
    }
    const isProductExists = yield prisma_1.default.product.findFirst({
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
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Product is Not found");
    }
    const isUserExists = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        },
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createRating = yield tx.rating.upsert({
            where: {
                userId_productId: {
                    userId: isUserExists.id,
                    productId: isProductExists.id,
                },
            },
            update: {
                value: req.body.value,
                review: req.body.review,
            },
            create: {
                userId: isUserExists.id,
                productId: isProductExists.id,
                value: req.body.value,
                review: req.body.review,
            },
        });
        if (!createRating) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "Rating has not been created");
        }
        const average = yield tx.rating.aggregate({
            _avg: {
                value: true,
            },
            _count: {
                value: true,
            },
            where: {
                productId: isProductExists.id,
            },
        });
        const averageCount = new library_1.Decimal(average._count.value || 0);
        const averageRatting = new library_1.Decimal(average._avg.value || 0);
        const result = yield tx.product.update({
            where: {
                id: isProductExists.id,
            },
            data: {
                rating: averageCount,
                averageRating: averageRatting,
            },
        });
        return result;
    }));
    return result;
});
const getAllDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.rating.findMany({
        include: {
            user: {
                select: {
                    email: true,
                },
            },
            product: true,
        },
    });
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield prisma_1.default.product.findFirstOrThrow({
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
        select: {
            id: true,
        },
    });
    const result = yield prisma_1.default.rating.findMany({
        where: {
            productId: isProductExists.id,
        },
        include: {
            user: {
                select: {
                    admin: true,
                    vendor: true,
                    customer: true,
                },
            },
        },
    });
    return result;
});
const updateByIdIntoDB = () => { };
const deleteByIdFromDB = () => { };
exports.ReviewServices = {
    createDataIntoDB,
    getAllDataFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
    deleteByIdFromDB,
};
