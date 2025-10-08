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
exports.OrderServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const checkout = (user, shippingInfo, paymentType) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: { email: user === null || user === void 0 ? void 0 : user.email, status: client_1.UserStatus.ACTIVE },
        select: { id: true, email: true },
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const cartItems = yield tx.cart.findMany({
            where: { userId: userInfo.id },
            include: {
                product: {
                    select: {
                        id: true,
                        sellerId: true,
                        name: true,
                        stock: true,
                        price: true,
                        discount: true,
                        seller: { select: { vendor: { select: { district: true } } } },
                    },
                },
            },
        });
        if (!cartItems.length) {
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
        }
        // group by seller
        const sellerGroups = {};
        for (const item of cartItems) {
            const sellerId = item.product.sellerId;
            if (!sellerGroups[sellerId])
                sellerGroups[sellerId] = [];
            sellerGroups[sellerId].push(item);
        }
        const orders = [];
        for (const [sellerId, items] of Object.entries(sellerGroups)) {
            // stock validation
            for (const item of items) {
                if (item.quantity > item.product.stock) {
                    throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Only ${item.product.stock} items are in stock for ${item.product.name}`);
                }
            }
            // per item discount & total calculation
            let totalPrice = 0;
            let totalDiscount = 0;
            const orderItemsData = items.map((cart) => {
                const price = Number(cart.product.price);
                const discountPercent = Number(cart.product.discount);
                const discountAmount = discountPercent > 0 ? (price * discountPercent) / 100 : 0;
                const totalPriceWithoutDiscount = price * cart.quantity;
                const totalDiscountAmount = discountAmount * cart.quantity;
                const totalPriceAfterDiscount = totalPriceWithoutDiscount - totalDiscountAmount;
                totalPrice += totalPriceWithoutDiscount;
                totalDiscount += totalDiscountAmount;
                return {
                    productId: cart.productId,
                    quantity: cart.quantity,
                    productImage: cart.productImage,
                    price,
                    discountPrice: totalPriceAfterDiscount,
                };
            });
            // seller-wise delivery charge
            const sellerDistrict = ((_a = items[0].product.seller.vendor) === null || _a === void 0 ? void 0 : _a.district) || "";
            const deliveryCharge = sellerDistrict === shippingInfo.districts ? 80 : 130;
            const finalAmount = totalPrice - totalDiscount + deliveryCharge;
            const lastOrder = yield tx.order.findFirst({
                orderBy: { createdAt: "desc" },
            });
            let nextId = 1;
            if (lastOrder) {
                const lastIdNum = parseInt((_b = lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.id) === null || _b === void 0 ? void 0 : _b.replace("ORD-", ""), 10);
                nextId = lastIdNum + 1;
            }
            const padded = nextId.toString().padStart(5, "0");
            const newOrder = `ORD-${padded}`;
            // create order
            const order = yield tx.order.create({
                data: {
                    id: newOrder,
                    userId: userInfo.id,
                    sellerId,
                    totalAmount: new client_1.Prisma.Decimal(finalAmount),
                    paymentType,
                    paymentStatus: "PENDING",
                    status: "PENDING",
                    shippingInfo,
                    deliveryCharge: new client_1.Prisma.Decimal(deliveryCharge),
                    orderItem: {
                        create: orderItemsData.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            productImage: item.productImage,
                            price: item.price,
                            discountPrice: item.discountPrice,
                        })),
                    },
                },
            });
            // update stock
            yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield tx.product.findUnique({
                    where: { id: item.productId },
                    select: { stock: true },
                });
                if (!product)
                    throw new Error(`Product not found: ${item.productId}`);
                const newStock = product.stock - item.quantity;
                yield tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        status: newStock <= 0 ? "OUT_OF_STOCK" : undefined,
                    },
                });
            })));
            orders.push({
                order,
                items: orderItemsData.map((item, idx) => ({
                    productId: item.productId,
                    productName: items[idx].product.name,
                    productImage: items[idx].productImage,
                    quantity: item.quantity,
                    price: item.price,
                    discountPrice: item.discountPrice,
                })),
            });
        }
        // clear cart
        yield tx.cart.deleteMany({ where: { userId: userInfo.id } });
        // create invoice
        const totalAmount = new client_1.Prisma.Decimal(orders.reduce((sum, o) => sum + Number(o.order.totalAmount), 0));
        const deliveryCharge = new client_1.Prisma.Decimal(orders.reduce((sum, o) => sum + Number(o.order.deliveryCharge), 0));
        const subTotal = totalAmount.minus(deliveryCharge);
        const lastInvoice = yield tx.invoice.findFirst({
            orderBy: { createdAt: "desc" },
        });
        let nextId = 1;
        if (lastInvoice) {
            const lastIdNum = parseInt((_c = lastInvoice === null || lastInvoice === void 0 ? void 0 : lastInvoice.id) === null || _c === void 0 ? void 0 : _c.replace("INV-", ""), 10);
            nextId = lastIdNum + 1;
        }
        const padded = nextId.toString().padStart(5, "0");
        const newInvoiceId = `INV-${padded}`;
        const invoice = yield tx.invoice.create({
            data: {
                id: newInvoiceId,
                userId: userInfo.id,
                orderIds: orders.map((o) => o.order.id),
                sellerIds: orders.map((o) => o.order.sellerId),
                totalAmount,
                deliveryCharge,
                subTotal,
                createdAtList: orders.map((o) => o.order.createdAt),
                shippingInfo,
                paymentType,
                orderItems: {
                    create: orders.flatMap((o) => o.items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        productImage: item.productImage,
                        price: new client_1.Prisma.Decimal(item.price),
                        discountPrice: new client_1.Prisma.Decimal(item.discountPrice),
                    }))),
                },
            },
            include: {
                orderItems: true,
            },
        });
        return {
            mainOrderId: orders[0].order.id,
            totalSellers: orders.length,
            totalOrders: orders.map((o) => o.order.id),
            orders,
            invoice,
        };
    }), {
        timeout: 20000,
    });
    return result;
});
const getAllDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
            role: client_1.UserRole.ADMIN,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const isOrderExists = yield prisma_1.default.order.findMany({
        select: {
            id: true,
            userId: true,
            totalAmount: true,
            paymentStatus: true,
            paymentType: true,
            status: true,
            deliveryCharge: true,
            shippingInfo: true,
            orderItem: true,
        },
    });
    return isOrderExists;
});
const getMyVendorDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
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
    return isOrderExists;
});
const getMyDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
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
    const isOrderExists = yield prisma_1.default.order.findMany({
        where: {
            userId: userInfo.id,
        },
        include: {
            orderItem: true,
        },
    });
    return isOrderExists;
});
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
    const isOrderExists = yield prisma_1.default.order.findFirstOrThrow({
        where: {
            id: id,
        },
        include: {
            orderItem: {
                include: {
                    product: true,
                },
            },
        },
    });
    return isOrderExists;
});
const getByIdsFromDB = (user, ids) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirst({
        where: { email: user === null || user === void 0 ? void 0 : user.email, status: client_1.UserStatus.ACTIVE },
        select: { id: true, email: true, role: true, status: true },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const orders = yield prisma_1.default.order.findMany({
        where: { id: { in: ids } },
        // include: { orderItem: { include: { product: true } } },
    });
    if (!orders || orders.length === 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Orders not found");
    }
    const orderItems = yield Promise.all(orders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield prisma_1.default.orderItem.findMany({
            where: { orderId: order.id },
        });
        return Object.assign(Object.assign({}, order), { items });
    })));
    const mergedOrder = {
        ids: [],
        userId: [],
        sellerId: [],
        totalAmount: 0,
        deliveryCharge: 0,
        createdAt: [],
        orderItem: [],
    };
    orderItems.forEach((order) => {
        mergedOrder.ids.push(order.id);
        mergedOrder.userId.push(order.userId);
        mergedOrder.sellerId.push(order.sellerId);
        mergedOrder.totalAmount += Number(order.totalAmount); // string থেকে number
        mergedOrder.deliveryCharge += Number(order.deliveryCharge);
        mergedOrder.createdAt.push(order.createdAt);
        if (order.items && order.items.length > 0) {
            mergedOrder.orderItem.push(...order.items);
        }
    });
    console.log(mergedOrder);
    return mergedOrder;
});
const orderStatus = (current, payload) => {
    if (current === payload) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, `Same status no update needed`);
    }
    if (current === client_1.OrderStatus.DELIVERED || current === client_1.OrderStatus.CANCELLED) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, `Order already ${current}, can't change `);
    }
    if (current === client_1.OrderStatus.PENDING &&
        (payload === client_1.OrderStatus.SHIPPED || payload === client_1.OrderStatus.CANCELLED)) {
        return true;
    }
    if (current === client_1.OrderStatus.SHIPPED && payload === client_1.OrderStatus.DELIVERED) {
        return true;
    }
};
const updateStatusByIdIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExists = yield prisma_1.default.order.findFirstOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            status: true,
        },
    });
    if (!orderStatus(isOrderExists.status, payload.status)) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, `Status can't change transition from ${isOrderExists.status} to ${payload.status}`);
    }
    const updateStatus = yield prisma_1.default.order.update({
        where: {
            id: isOrderExists.id,
        },
        data: payload,
    });
    return updateStatus;
});
const orderPaymentStatus = (current, payload) => {
    if (current === payload) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, `Same status no update needed`);
    }
    if (current === client_1.OrderPaymentStatus.FAILED ||
        current === client_1.OrderPaymentStatus.PAID) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, `Order already ${current}, can't change `);
    }
    if (current === client_1.OrderPaymentStatus.PENDING &&
        (payload === client_1.OrderPaymentStatus.PAID ||
            payload === client_1.OrderPaymentStatus.FAILED)) {
        return true;
    }
};
const updatePaymentStatusByIdIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExists = yield prisma_1.default.order.findFirstOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            paymentStatus: true,
        },
    });
    if (!orderPaymentStatus(isOrderExists.paymentStatus, payload.paymentStatus)) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, `Invalid status transition from ${isOrderExists.paymentStatus} to ${payload.paymentStatus}`);
    }
    const updateStatus = yield prisma_1.default.order.update({
        where: {
            id: isOrderExists.id,
        },
        data: payload,
    });
    return updateStatus;
});
const deleteByIdFromDB = () => { };
exports.OrderServices = {
    checkout,
    getAllDataFromDB,
    getByIdFromDB,
    getByIdsFromDB,
    updateStatusByIdIntoDB,
    deleteByIdFromDB,
    getMyDataFromDB,
    getMyVendorDataFromDB,
    updatePaymentStatusByIdIntoDB,
};
//  const invoice = {
//       ids: orders.map((item) => item.order.id),
//       userId: userInfo.id,
//       sellerIds: orders.map((item) => item.order.sellerId),
//       totalAmount: orders.reduce(
//         (sum, item) => sum + Number(item.order.totalAmount),
//         0
//       ),
//       deliveryCharge: orders.reduce(
//         (sum, item) => sum + Number(item.order.deliveryCharge),
//         0
//       ),
//       createdAt: orders.map((item) => item.order.createdAt),
//       orderItems: orders.flatMap((item) => item.items),
//       shippingInfo,
//       paymentType,
//     };
