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
  // payload
  payload.productName = isProductExists.name;
  payload.basePrice = isProductExists.price;
  payload.price = basePrice;
  payload.productImage = isProductExists.productImages[0];
  if (Number(isProductExists.discount) > 0) {
    const discountAmount = basePrice
      .mul(new Prisma.Decimal(isProductExists.discount))
      .div(100);

    payload.discountPrice = basePrice.sub(discountAmount);
    payload.discountAmount = discountAmount;
    payload.discountPercent = new Prisma.Decimal(isProductExists.discount);
  }

  // return payload;

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

const getShippingSummery = async (user: JwtPayload) => {
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

  const cartList = await prisma.cart.findMany({
    where: { userId: userInfo.id },
    select: {
      quantity: true,
      price: true,
      discountPrice: true,
    },
  });

  const cartSummary = cartList.reduce(
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

  return cartSummary;
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
  if (Number(isProductExists.discount) > 0) {
    const discountAmount = basePrice
      .mul(new Prisma.Decimal(isProductExists.discount))
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

const deleteByIdFromDB = async (user: JwtPayload, id: string) => {
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
  getShippingSummery,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
