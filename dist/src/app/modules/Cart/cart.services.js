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
exports.CartServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const createDataIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const isProductExists = yield prisma_1.default.product.findFirst({
        where: {
            id: payload.productId,
            status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            },
        },
    });
    const isCartExists = yield prisma_1.default.cart.findFirst({
        where: {
            AND: {
                userId: userInfo.id,
                productId: isProductExists === null || isProductExists === void 0 ? void 0 : isProductExists.id,
            },
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    if (!isProductExists) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Product is not found");
    }
    if (isCartExists) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, "Product is already added");
    }
    if (!payload.quantity) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Quantity is not found please provide it");
    }
    payload.userId = userInfo.id;
    const basePrice = new client_1.Prisma.Decimal(isProductExists.price).mul(payload.quantity);
    // payload
    payload.productName = isProductExists.name;
    payload.basePrice = isProductExists.price;
    payload.price = basePrice;
    payload.productImage = isProductExists.productImages[0];
    if (Number(isProductExists.discount) > 0) {
        const discountAmount = basePrice
            .mul(new client_1.Prisma.Decimal(isProductExists.discount))
            .div(100);
        payload.discountPrice = basePrice.sub(discountAmount);
        payload.discountAmount = discountAmount;
        payload.discountPercent = new client_1.Prisma.Decimal(isProductExists.discount);
    }
    // return payload;
    const result = yield prisma_1.default.cart.create({ data: payload });
    return result;
});
const getAllDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const cartInfo = yield prisma_1.default.cart.findMany({
        where: {
            userId: {
                in: [userInfo.id],
            },
        },
    });
    return cartInfo;
});
const getAllCartDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const cartInfo = yield prisma_1.default.cart.findMany({});
    return cartInfo;
});
// const getShippingSummery = async (user: JwtPayload) => {
//   const userInfo = await prisma.user.findFirstOrThrow({
//     where: {
//       email: user?.email,
//       status: UserStatus.ACTIVE,
//     },
//     select: {
//       id: true,
//       email: true,
//       role: true,
//       status: true,
//     },
//   });
//   if (!userInfo) {
//     throw new ApiError(status.NOT_FOUND, "User is not found");
//   }
//   const cartList = await prisma.cart.findMany({
//     where: { userId: userInfo.id },
//     select: {
//       quantity: true,
//       price: true,
//       discountPrice: true,
//       product: {
//         select: {
//           id: true,
//           sellerId: true,
//         },
//       },
//     },
//   });
//   const cartSummary = cartList.reduce(
//     (acc, item) => {
//       acc.totalItems += 1;
//       acc.totalQuantity += item.quantity;
//       if (Number(item.discountPrice) > 0) {
//         acc.totalDiscountPrice += Number(item.discountPrice);
//         acc.totalPrice += Number(item.price);
//       } else {
//         acc.totalDiscountPrice += Number(item.price);
//         acc.totalPrice += Number(item.price);
//       }
//       acc.sellers.push({
//         productId: item.product.id,
//         sellerId: item.product.sellerId,
//       });
//       return acc;
//     },
//     {
//       totalItems: 0,
//       totalQuantity: 0,
//       totalDiscountPrice: 0,
//       totalPrice: 0,
//       sellers: [] as { productId: string; sellerId: string }[],
//     }
//   );
//   return cartSummary;
// };
const getByIdFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const cartInfo = yield prisma_1.default.cart.findUnique({
        where: {
            id,
            userId: userInfo.id,
        },
    });
    return cartInfo;
});
const updateByIdIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const isProductExists = yield prisma_1.default.product.findFirst({
        where: {
            id: payload.productId,
            status: {
                in: [
                    client_1.ProductStatus.ACTIVE,
                    client_1.ProductStatus.DISCONTINUED,
                    client_1.ProductStatus.OUT_OF_STOCK,
                ],
            },
        },
    });
    const isCartExists = yield prisma_1.default.cart.findFirst({
        where: {
            AND: {
                userId: userInfo.id,
                productId: isProductExists === null || isProductExists === void 0 ? void 0 : isProductExists.id,
            },
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    if (!isProductExists) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Product is not found");
    }
    if (!isCartExists) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Cart is not found");
    }
    if (!payload.quantity) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Quantity is not found please provide it");
    }
    const basePrice = new client_1.Prisma.Decimal(isProductExists.price).mul(payload.quantity);
    payload.price = basePrice;
    if (Number(isProductExists.discount) > 0) {
        const discountAmount = basePrice
            .mul(new client_1.Prisma.Decimal(isProductExists.discount))
            .div(100);
        payload.discountPrice = basePrice.sub(discountAmount);
        payload.discountAmount = discountAmount;
    }
    const result = yield prisma_1.default.cart.update({
        where: {
            id: isCartExists.id,
            productId: isProductExists.id,
        },
        data: payload,
    });
    return result;
});
const deleteByIdFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const cartInfo = yield prisma_1.default.cart.delete({
        where: {
            id,
            userId: userInfo.id,
        },
    });
    return cartInfo;
});
const getShippingSummery = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const cartList = yield prisma_1.default.cart.findMany({
        where: { userId: userInfo.id },
        select: {
            quantity: true,
            price: true,
            discountPrice: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    seller: {
                        select: {
                            email: true,
                            vendor: {
                                select: {
                                    district: true,
                                    city: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    const cartSummary = cartList.reduce((acc, item) => {
        var _a, _b;
        acc.totalItems += 1;
        acc.totalQuantity += item.quantity;
        if (Number(item.discountPrice) > 0) {
            acc.totalDiscountPrice += Number(item.discountPrice);
            acc.totalPrice += Number(item.price);
        }
        else {
            acc.totalDiscountPrice += Number(item.price);
            acc.totalPrice += Number(item.price);
        }
        const sellerInfo = item.product.seller;
        acc.sellers.push({
            email: sellerInfo.email,
            district: ((_a = sellerInfo.vendor) === null || _a === void 0 ? void 0 : _a.district) || null,
            city: ((_b = sellerInfo.vendor) === null || _b === void 0 ? void 0 : _b.city) || null,
        });
        return acc;
    }, {
        totalItems: 0,
        totalQuantity: 0,
        totalDiscountPrice: 0,
        totalPrice: 0,
        sellers: [],
    });
    const uniqueSellers = new Set(cartSummary.sellers.map((s) => s.email));
    return Object.assign(Object.assign({}, cartSummary), { sellerCount: uniqueSellers.size });
});
exports.CartServices = {
    createDataIntoDB,
    getAllDataFromDB,
    getShippingSummery,
    getAllCartDataFromDB,
    getByIdFromDB,
    updateByIdIntoDB,
    deleteByIdFromDB,
};
