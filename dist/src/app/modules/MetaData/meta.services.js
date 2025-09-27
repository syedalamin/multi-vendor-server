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
exports.VendorMetaServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const client_1 = require("@prisma/client");
const getMyVendorMetaDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
            role: client_1.UserRole.VENDOR,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const isOrderExists = yield prisma_1.default.order.findMany({
        where: {
            sellerId: userInfo.id,
        },
        include: {
            orderItem: true,
        },
    });
    const pendingSummary = yield prisma_1.default.order.aggregate({
        where: {
            sellerId: userInfo.id,
            paymentStatus: client_1.OrderPaymentStatus.PENDING,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
    });
    const paidSummary = yield prisma_1.default.order.aggregate({
        where: {
            sellerId: userInfo.id,
            paymentStatus: client_1.OrderPaymentStatus.PAID,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
    });
    const failedSummary = yield prisma_1.default.order.aggregate({
        where: {
            sellerId: userInfo.id,
            paymentStatus: client_1.OrderPaymentStatus.FAILED,
        },
        _count: { id: true },
        _sum: { totalAmount: true },
    });
    const orderSummary = yield prisma_1.default.order.aggregate({
        where: {
            sellerId: userInfo.id,
        },
        _count: { id: true },
        _sum: { totalAmount: true, deliveryCharge: true },
    });
    const pendingOrderIds = isOrderExists
        .filter((order) => order.paymentStatus === client_1.OrderPaymentStatus.PENDING)
        .map((order) => order.id);
    const paidOrderIds = isOrderExists
        .filter((order) => order.paymentStatus === client_1.OrderPaymentStatus.PAID)
        .map((order) => order.id);
    const failedOrderIds = isOrderExists
        .filter((order) => order.paymentStatus === client_1.OrderPaymentStatus.FAILED)
        .map((order) => order.id);
    const getProductSummaryByOrderIds = (orderIds) => __awaiter(void 0, void 0, void 0, function* () {
        const summary = yield prisma_1.default.orderItem.groupBy({
            by: ["orderId"],
            where: { orderId: { in: orderIds } },
            _count: { productId: true },
            _sum: { quantity: true },
        });
        return summary.reduce((acc, curr) => {
            acc._count.productId += curr._count.productId;
            acc._sum.quantity += curr._sum.quantity || 0;
            return acc;
        }, { _count: { productId: 0 }, _sum: { quantity: 0 } });
    });
    const pendingProductSummary = yield getProductSummaryByOrderIds(pendingOrderIds);
    const paidProductSummary = yield getProductSummaryByOrderIds(paidOrderIds);
    const failedProductSummary = yield getProductSummaryByOrderIds(failedOrderIds);
    return {
        pendingSummary,
        paidSummary,
        failedSummary,
        orderSummary,
        pendingProductSummary,
        paidProductSummary,
        failedProductSummary,
    };
});
const getAllAdminMetaDataFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield prisma_1.default.user.aggregate({
        _count: { id: true },
    });
    const allAdmin = yield prisma_1.default.admin.aggregate({
        _count: { id: true },
    });
    const allVendor = yield prisma_1.default.vendor.aggregate({
        _count: { id: true },
    });
    const allCustomer = yield prisma_1.default.customer.aggregate({
        _count: { id: true },
    });
    const isOrderExists = yield prisma_1.default.order.findMany({
        include: { orderItem: true },
    });
    const pendingSummary = yield prisma_1.default.order.aggregate({
        where: { paymentStatus: client_1.OrderPaymentStatus.PENDING },
        _count: { id: true },
        _sum: { totalAmount: true },
    });
    const paidSummary = yield prisma_1.default.order.aggregate({
        where: { paymentStatus: client_1.OrderPaymentStatus.PAID },
        _count: { id: true },
        _sum: { totalAmount: true },
    });
    const failedSummary = yield prisma_1.default.order.aggregate({
        where: { paymentStatus: client_1.OrderPaymentStatus.FAILED },
        _count: { id: true },
        _sum: { totalAmount: true },
    });
    const orderSummary = yield prisma_1.default.order.aggregate({
        _count: { id: true },
        _sum: { totalAmount: true, deliveryCharge: true },
    });
    const pendingOrderIds = isOrderExists
        .filter((order) => order.paymentStatus === client_1.OrderPaymentStatus.PENDING)
        .map((order) => order.id);
    const paidOrderIds = isOrderExists
        .filter((order) => order.paymentStatus === client_1.OrderPaymentStatus.PAID)
        .map((order) => order.id);
    const failedOrderIds = isOrderExists
        .filter((order) => order.paymentStatus === client_1.OrderPaymentStatus.FAILED)
        .map((order) => order.id);
    const getProductSummaryByOrderIds = (orderIds) => __awaiter(void 0, void 0, void 0, function* () {
        const summary = yield prisma_1.default.orderItem.groupBy({
            by: ["orderId"],
            where: { orderId: { in: orderIds } },
            _count: { productId: true },
            _sum: { quantity: true, price: true, discountPrice: true },
        });
        return summary.reduce((acc, curr) => {
            acc._count.productId += curr._count.productId;
            acc._sum.quantity += curr._sum.quantity || 0;
            return acc;
        }, { _count: { productId: 0 }, _sum: { quantity: 0 } });
    });
    const pendingProductSummary = yield getProductSummaryByOrderIds(pendingOrderIds);
    const paidProductSummary = yield getProductSummaryByOrderIds(paidOrderIds);
    const failedProductSummary = yield getProductSummaryByOrderIds(failedOrderIds);
    return {
        allUser,
        allAdmin,
        allVendor,
        allCustomer,
        orderSummary,
        pendingSummary,
        paidSummary,
        failedSummary,
        pendingProductSummary,
        paidProductSummary,
        failedProductSummary,
    };
});
exports.VendorMetaServices = {
    getMyVendorMetaDataFromDB,
    getAllAdminMetaDataFromDB,
};
