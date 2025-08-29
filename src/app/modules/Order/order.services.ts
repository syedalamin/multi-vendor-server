import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { OrderStatus, Prisma, UserRole, UserStatus } from "@prisma/client";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { IShippingInfoRequest } from "./order.interface";

const checkout = async (
  user: JwtPayload,
  shippingInfo: IShippingInfoRequest,
  paymentType: any
) => {
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

  const result = await prisma.$transaction(async (tx) => {
    const isCartExists = await tx.cart.findMany({
      where: {
        userId: userInfo.id,
      },
      include: {
        product: {
          select: {
            name: true,
            productImages: true,
            stock: true,
          },
        },
      },
    });

    if (!isCartExists.length) {
      throw new ApiError(status.BAD_REQUEST, "Cart is empty");
    }

    for (const item of isCartExists) {
      if (item.quantity > item.product.stock) {
        throw new ApiError(
          status.BAD_REQUEST,
          `Only ${item.product.stock} items are in stock, but you requested ${item.quantity}.`
        );
      }
    }

    const cartSummary = isCartExists.reduce(
      (acc, item) => {
        acc.totalItems += 1;
        acc.totalQuantity += item.quantity;

        if (Number(item.discountPrice) > 0) {
          acc.totalDiscountPrice += Number(item.discountPrice);
          acc.totalPrice += Number(item.price);
        } else {
          acc.totalDiscountPrice += Number(item.price);
          acc.totalPrice += Number(item.price);
        }

        return acc;
      },
      { totalItems: 0, totalQuantity: 0, totalDiscountPrice: 0, totalPrice: 0 }
    );

    let deliveryCharge;
    if (shippingInfo.districts.toLowerCase() != "dhaka") {
      deliveryCharge = Number(130);
    } else {
      deliveryCharge = Number(80);
    }

    let finalAmount;
    if (
      cartSummary.totalDiscountPrice > 0 &&
      cartSummary.totalDiscountPrice < cartSummary.totalPrice
    ) {
      finalAmount = cartSummary.totalDiscountPrice + deliveryCharge;
    } else {
      finalAmount = cartSummary.totalPrice + deliveryCharge;
    }

    const order = await tx.order.create({
      data: {
        userId: userInfo.id,
        totalAmount: new Prisma.Decimal(finalAmount),
        paymentType: paymentType,
        paymentStatus: "PENDING",
        status: "PENDING",
        shippingInfo,
        deliveryCharge: new Prisma.Decimal(deliveryCharge),
      },
    });

    const orderItemsData = isCartExists.map((cart) => ({
      orderId: order.id,
      productId: cart.productId,
      quantity: cart.quantity,
      price: cart.price,
      discountPrice: cart.discountPrice,
    }));

    const orderItem = await tx.orderItem.createMany({
      data: orderItemsData,
    });

    for (const item of isCartExists) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cart.deleteMany({ where: { userId: userInfo.id } });

    return { order, orderItem };
  });

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
  const isOrderExists = await prisma.order.findMany({});

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
      orderItem: true,
    },
  });

  return isOrderExists;
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
      `Invalid status transition from ${isOrderExists.status} to ${payload.status}`
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
  updateStatusByIdIntoDB,
  deleteByIdFromDB,
  getMyDataFromDB
};
