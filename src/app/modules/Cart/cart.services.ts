import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { Cart, Prisma, ProductStatus, UserStatus } from "@prisma/client";

const createDataIntoDB = async (
  user: JwtPayload,
  payload: Cart
): Promise<Cart> => {
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

  const isProductExists = await prisma.product.findFirst({
    where: {
      id: payload.productId,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
  });

  const isCartExists = await prisma.cart.findFirst({
    where: {
      AND: {
        userId: userInfo.id,
        productId: isProductExists?.id,
      },
    },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }
  if (!isProductExists) {
    throw new ApiError(status.NOT_FOUND, "Product is not found");
  }

  if (isCartExists) {
    throw new ApiError(status.CONFLICT, "Product is already added");
  }

  if (!payload.quantity) {
    throw new ApiError(
      status.NOT_FOUND,
      "Quantity is not found please provide it"
    );
  }
  payload.userId = userInfo.id;

  const basePrice = new Prisma.Decimal(isProductExists.price).mul(
    payload.quantity
  );
  payload.price = basePrice;
  if (payload.discountPercent) {
    const discountAmount = basePrice
      .mul(new Prisma.Decimal(payload.discountPercent))
      .div(100);
    payload.discountPrice = basePrice.sub(discountAmount);
    payload.discountAmount = discountAmount;
  }

  const result = await prisma.cart.create({ data: payload });

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

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  const cartInfo = await prisma.cart.findMany({
    where: {
      userId: {
        in: [userInfo.id],
      },
    },
  });

  return cartInfo;
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

  const cartInfo = await prisma.cart.findUnique({
    where: {
      id,
      userId: userInfo.id,
    },
  });

  return cartInfo;
};

const updateByIdIntoDB = async (user: JwtPayload, payload: Partial<Cart>) => {
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

  const isProductExists = await prisma.product.findFirst({
    where: {
      id: payload.productId,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
  });

  const isCartExists = await prisma.cart.findFirst({
    where: {
      AND: {
        userId: userInfo.id,
        productId: isProductExists?.id,
      },
    },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }
  if (!isProductExists) {
    throw new ApiError(status.NOT_FOUND, "Product is not found");
  }

  if (!isCartExists) {
    throw new ApiError(status.NOT_FOUND, "Cart is not found");
  }

  if (!payload.quantity) {
    throw new ApiError(
      status.NOT_FOUND,
      "Quantity is not found please provide it"
    );
  }

  const basePrice = new Prisma.Decimal(isProductExists.price).mul(
    payload.quantity
  );
  payload.price = basePrice;
  if (payload.discountPercent) {
    const discountAmount = basePrice
      .mul(new Prisma.Decimal(payload.discountPercent))
      .div(100);
    payload.discountPrice = basePrice.sub(discountAmount);
    payload.discountAmount = discountAmount;
  }

  const result = await prisma.cart.update({
    where: {
      id: isCartExists.id,
      productId: isProductExists.id,
    },
    data: payload,
  });

  return result;
};
const deleteByIdFromDB = async(user: JwtPayload, id: string) => {

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

  const cartInfo = await prisma.cart.delete({
    where: {
      id,
      userId: userInfo.id,
    },
  });

  return cartInfo;
};

export const CartServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
