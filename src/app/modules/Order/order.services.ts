import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import {
  OrderPaymentStatus,
  OrderStatus,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { IShippingInfoRequest } from "./order.interface";

const checkout = async (
  user: JwtPayload,
  shippingInfo: IShippingInfoRequest,
  paymentType: any
) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: { email: user?.email, status: UserStatus.ACTIVE },
    select: { id: true, email: true },
  });

  const result = await prisma.$transaction(
    async (tx) => {
      const cartItems = await tx.cart.findMany({
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
        throw new ApiError(status.BAD_REQUEST, "Cart is empty");
      }

      // group by seller
      const sellerGroups: Record<string, typeof cartItems> = {};

      for (const item of cartItems) {
        const sellerId = item.product.sellerId;
        if (!sellerGroups[sellerId]) sellerGroups[sellerId] = [];
        sellerGroups[sellerId].push(item);
      }

      const orders: any[] = [];

      for (const [sellerId, items] of Object.entries(sellerGroups)) {
        // stock validation
        for (const item of items) {
          if (item.quantity > item.product.stock) {
            throw new ApiError(
              status.BAD_REQUEST,
              `Only ${item.product.stock} items are in stock for ${item.product.name}`
            );
          }
        }

        // per item discount & total calculation
        let totalPrice = 0;
        let totalDiscount = 0;

        const orderItemsData = items.map((cart) => {
          const price = Number(cart.product.price);
          const discountPercent = Number(cart.product.discount);
          const discountAmount =
            discountPercent > 0 ? (price * discountPercent) / 100 : 0;

          const totalPriceWithoutDiscount = price * cart.quantity;
          const totalDiscountAmount = discountAmount * cart.quantity;
          const totalPriceAfterDiscount =
            totalPriceWithoutDiscount - totalDiscountAmount;

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
        const sellerDistrict = items[0].product.seller.vendor?.district || "";
        const deliveryCharge =
          sellerDistrict === shippingInfo.districts ? 80 : 130;

        const finalAmount = totalPrice - totalDiscount + deliveryCharge;

        const lastOrder = await tx.order.findFirst({
          orderBy: { createdAt: "desc" },
        });

        let nextId = 1;

        if (lastOrder) {
          const lastIdNum = parseInt(lastOrder?.id?.replace("ORD-", ""), 10);
          nextId = lastIdNum + 1;
        }

        const padded = nextId.toString().padStart(5, "0");
        const newOrder = `ORD-${padded}`;

        // create order
        const order = await tx.order.create({
          data: {
            id: newOrder,
            userId: userInfo.id,
            sellerId,
            totalAmount: new Prisma.Decimal(finalAmount),
            paymentType,
            paymentStatus: "PENDING",
            status: "PENDING",
            shippingInfo,
            deliveryCharge: new Prisma.Decimal(deliveryCharge),
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
        await Promise.all(
          items.map(async (item) => {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
              select: { stock: true },
            });

            if (!product)
              throw new Error(`Product not found: ${item.productId}`);

            const newStock = product.stock - item.quantity;

            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
                status: newStock <= 0 ? "OUT_OF_STOCK" : undefined,
              },
            });
          })
        );

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
      await tx.cart.deleteMany({ where: { userId: userInfo.id } });

      // create invoice
      const totalAmount = new Prisma.Decimal(
        orders.reduce((sum, o) => sum + Number(o.order.totalAmount), 0)
      );

      const deliveryCharge = new Prisma.Decimal(
        orders.reduce((sum, o) => sum + Number(o.order.deliveryCharge), 0)
      );

      const subTotal = totalAmount.minus(deliveryCharge);

      const lastInvoice = await tx.invoice.findFirst({
        orderBy: { createdAt: "desc" },
      });

      let nextId = 1;

      if (lastInvoice) {
        const lastIdNum = parseInt(lastInvoice?.id?.replace("INV-", ""), 10);
        nextId = lastIdNum + 1;
      }

      const padded = nextId.toString().padStart(5, "0");
      const newInvoiceId = `INV-${padded}`;

      const invoice = await tx.invoice.create({
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
            create: orders.flatMap((o) =>
              o.items.map((item: any) => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                productImage: item.productImage,
                price: new Prisma.Decimal(item.price),
                discountPrice: new Prisma.Decimal(item.discountPrice),
              }))
            ),
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
    },
    {
      timeout: 20000,
    }
  );

  return result;
};

const getAllDataFromDB = async (user: JwtPayload) => {
  await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isOrderExists = await prisma.order.findMany({
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
};

const getMyVendorDataFromDB = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
      role: UserRole.VENDOR,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isOrderExists = await prisma.order.findMany({
    where: {
      sellerId: userInfo.id,
    },
    include: {
      orderItem: true,
    },
  });

  return isOrderExists;
};

const getMyDataFromDB = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isOrderExists = await prisma.order.findMany({
    where: {
      userId: userInfo.id,
    },
    include: {
      orderItem: true,
    },
  });

  return isOrderExists;
};

const getByIdFromDB = async (user: JwtPayload, id: string) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  const isOrderExists = await prisma.order.findFirstOrThrow({
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
};

const getByIdsFromDB = async (user: JwtPayload, ids: string[]) => {
  const userInfo = await prisma.user.findFirst({
    where: { email: user?.email, status: UserStatus.ACTIVE },
    select: { id: true, email: true, role: true, status: true },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  const orders = await prisma.order.findMany({
    where: { id: { in: ids } },
    // include: { orderItem: { include: { product: true } } },
  });

  if (!orders || orders.length === 0) {
    throw new ApiError(status.NOT_FOUND, "Orders not found");
  }

  const orderItems = await Promise.all(
    orders.map(async (order) => {
      const items = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      });
      return {
        ...order,
        items,
      };
    })
  );

  const mergedOrder = {
    ids: [] as string[],
    userId: [] as string[],
    sellerId: [] as string[],
    totalAmount: 0,
    deliveryCharge: 0,
    createdAt: [] as Date[],
    orderItem: [] as any[],
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
};

const orderStatus = (current: string, payload: OrderStatus) => {
  if (current === payload) {
    throw new ApiError(status.CONFLICT, `Same status no update needed`);
  }

  if (current === OrderStatus.DELIVERED || current === OrderStatus.CANCELLED) {
    throw new ApiError(
      status.CONFLICT,
      `Order already ${current}, can't change `
    );
  }

  if (
    current === OrderStatus.PENDING &&
    (payload === OrderStatus.SHIPPED || payload === OrderStatus.CANCELLED)
  ) {
    return true;
  }
  if (current === OrderStatus.SHIPPED && payload === OrderStatus.DELIVERED) {
    return true;
  }
};

const updateStatusByIdIntoDB = async (
  id: string,
  payload: { status: OrderStatus }
) => {
  const isOrderExists = await prisma.order.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!orderStatus(isOrderExists.status, payload.status)) {
    throw new ApiError(
      status.CONFLICT,
      `Status can't change transition from ${isOrderExists.status} to ${payload.status}`
    );
  }

  const updateStatus = await prisma.order.update({
    where: {
      id: isOrderExists.id,
    },
    data: payload,
  });

  return updateStatus;
};
const orderPaymentStatus = (current: string, payload: OrderPaymentStatus) => {
  if (current === payload) {
    throw new ApiError(status.CONFLICT, `Same status no update needed`);
  }

  if (
    current === OrderPaymentStatus.FAILED ||
    current === OrderPaymentStatus.PAID
  ) {
    throw new ApiError(
      status.CONFLICT,
      `Order already ${current}, can't change `
    );
  }

  if (
    current === OrderPaymentStatus.PENDING &&
    (payload === OrderPaymentStatus.PAID ||
      payload === OrderPaymentStatus.FAILED)
  ) {
    return true;
  }
};

const updatePaymentStatusByIdIntoDB = async (
  id: string,
  payload: { paymentStatus: OrderPaymentStatus }
) => {
  const isOrderExists = await prisma.order.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      paymentStatus: true,
    },
  });

  if (!orderPaymentStatus(isOrderExists.paymentStatus, payload.paymentStatus)) {
    throw new ApiError(
      status.CONFLICT,
      `Invalid status transition from ${isOrderExists.paymentStatus} to ${payload.paymentStatus}`
    );
  }

  const updateStatus = await prisma.order.update({
    where: {
      id: isOrderExists.id,
    },
    data: payload,
  });

  return updateStatus;
};

const deleteByIdFromDB = () => {};

export const OrderServices = {
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
