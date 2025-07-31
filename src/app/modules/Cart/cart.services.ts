import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { Cart, Prisma, ProductStatus, UserStatus } from "@prisma/client";

const createDataIntoDB = async (
  user: JwtPayload,
  params: Cart
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
      id: params.productId,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }
  if (!isProductExists) {
    throw new ApiError(status.NOT_FOUND, "Product is not found");
  }

  if (!params.quantity) {
    throw new ApiError(
      status.NOT_FOUND,
      "Quantity is not found please provide it"
    );
  }
  params.userId = userInfo.id;

  const basePrice = new Prisma.Decimal(isProductExists.price).mul(
    params.quantity
  );
  params.price = basePrice;
  if (params.discountPercent) {
    const discountAmount = basePrice
      .mul(new Prisma.Decimal(params.discountPercent))
      .div(100);
    params.discountPrice = basePrice.sub(discountAmount);
    params.discountAmount = discountAmount;
  }

  const result = await prisma.cart.create({ data: params });

  return result;
};

const getAllDataFromDB = () => {};
const getByIdFromDB = () => {};
const updateByIdIntoDB = () => {};
const deleteByIdFromDB = () => {};

export const CartServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
