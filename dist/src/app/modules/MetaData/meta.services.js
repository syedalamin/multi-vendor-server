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
const sendShopImageToCPanel_1 = __importDefault(require("../../../utils/sendShopImageToCPanel"));
const deleteImagesFromCPanel_1 = __importDefault(require("../../../utils/deleteImagesFromCPanel"));
const library_1 = require("@prisma/client/runtime/library");
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
const createHomePageImages = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    let homePageData = req.body;
    const existingImage = yield prisma_1.default.homePageImages.findUniqueOrThrow({
        where: {
            id: "home_page_single_entry",
        },
    });
    let sliderImages = existingImage.sliderImages || [];
    let heroImages = existingImage.heroImages || [];
    let hotDealImages = existingImage.hotDealImages || [];
    let hotMainImages = existingImage.hotMainImages || [];
    let reviewImages = existingImage.reviewImages || [];
    let reviewMainImages = existingImage.reviewMainImages || [];
    let footerImages = existingImage.footerImages || [];
    // removeSliderImages
    // removeHeroImages
    // removeHotDealImages
    // removeHotMainImages
    // removeReviewImages
    // removeReviewMainImages
    // removeFooterImages
    if (homePageData.removeFooterImages &&
        Array.isArray(homePageData.removeFooterImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeFooterImages);
        footerImages = footerImages.filter((img) => !homePageData.removeFooterImages.includes(img));
    }
    if (homePageData.removeReviewMainImages &&
        Array.isArray(homePageData.removeReviewMainImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeReviewMainImages);
        reviewMainImages = reviewMainImages.filter((img) => !homePageData.removeReviewMainImages.includes(img));
    }
    if (homePageData.removeReviewImages &&
        Array.isArray(homePageData.removeReviewImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeReviewImages);
        reviewImages = reviewImages.filter((img) => !homePageData.removeReviewImages.includes(img));
    }
    if (homePageData.removeHotMainImages &&
        Array.isArray(homePageData.removeHotMainImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeHotMainImages);
        hotMainImages = hotMainImages.filter((img) => !homePageData.removeHotMainImages.includes(img));
    }
    if (homePageData.removeHotDealImages &&
        Array.isArray(homePageData.removeHotDealImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeHotDealImages);
        hotDealImages = hotDealImages.filter((img) => !homePageData.removeHotDealImages.includes(img));
    }
    if (homePageData.removeHeroImages &&
        Array.isArray(homePageData.removeHeroImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeHeroImages);
        heroImages = heroImages.filter((img) => !homePageData.removeHeroImages.includes(img));
    }
    if (homePageData.removeSliderImages &&
        Array.isArray(homePageData.removeSliderImages)) {
        yield (0, deleteImagesFromCPanel_1.default)(homePageData.removeSliderImages);
        sliderImages = sliderImages.filter((img) => !homePageData.removeSliderImages.includes(img));
    }
    if (req.files) {
        if (files.sliderImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            sliderImages = [...sliderImages, ...imageUrl.sliderImages];
        }
        if (files.heroImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            heroImages = [...heroImages, ...imageUrl.heroImages];
        }
        if (files.hotDealImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            hotDealImages = [...hotDealImages, ...imageUrl.hotDealImages];
        }
        if (files.hotMainImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            hotMainImages = [...hotMainImages, ...imageUrl.hotMainImages];
        }
        if (files.reviewImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            reviewImages = [...reviewImages, ...imageUrl.reviewImages];
        }
        if (files.reviewMainImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            reviewMainImages = [...reviewMainImages, ...imageUrl.reviewMainImages];
        }
        if (files.footerImages) {
            const imageUrl = yield (0, sendShopImageToCPanel_1.default)(req);
            footerImages = [...footerImages, ...imageUrl.footerImages];
        }
    }
    let hours = existingImage.hours;
    let minutes = existingImage.minutes;
    if (homePageData.hours !== undefined)
        hours = new library_1.Decimal(homePageData.hours);
    if (homePageData.minutes !== undefined)
        minutes = new library_1.Decimal(homePageData.minutes);
    const result = yield prisma_1.default.homePageImages.update({
        where: {
            id: "home_page_single_entry",
        },
        data: {
            sliderImages: sliderImages,
            heroImages: heroImages,
            hotDealImages: hotDealImages,
            hotMainImages: hotMainImages,
            reviewImages: reviewImages,
            reviewMainImages: reviewMainImages,
            footerImages: footerImages,
            hours: hours,
            minutes: minutes,
        },
    });
    return result;
});
const getHomePageImages = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.homePageImages.findFirstOrThrow({
        where: {
            id: "home_page_single_entry",
        },
    });
    return result;
});
exports.VendorMetaServices = {
    getMyVendorMetaDataFromDB,
    getAllAdminMetaDataFromDB,
    createHomePageImages,
    getHomePageImages,
};
