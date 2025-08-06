import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { Prisma, UserStatus } from "@prisma/client";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { Decimal } from "@prisma/client/runtime/library";

const checkout = async (
  user: JwtPayload,
  shippingInfo: any,
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

    const totalPrice = isCartExists.reduce(
      (acc, item) => {
        acc.price += Number(item.price);
        acc.discountPrice += Number(item.discountPrice);

        return acc;
      },
      { price: 0, discountPrice: 0 }
    );

    const deliveryCharge = Number(50);

    let finalAmount;
    if (
      totalPrice.discountPrice > 0 &&
      totalPrice.discountPrice < totalPrice.price
    ) {
      finalAmount = totalPrice.discountPrice + deliveryCharge;
    } else {
      finalAmount = totalPrice.price + deliveryCharge;
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
const getByIdFromDB = () => {};
const updateByIdIntoDB = () => {};
const deleteByIdFromDB = () => {};

export const OrderServices = {
  checkout,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
