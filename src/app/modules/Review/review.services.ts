import { Decimal } from "@prisma/client/runtime/library";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import prisma from "../../../utils/share/prisma";
import { Request } from "express";
import { ProductStatus } from "@prisma/client";

const createDataIntoDB = async (id: string, req: Request) => {
  if (req.body.value > 5) {
    req.body.value = 5;
  }
  if (req.body.value < 0) {
    req.body.value = 0;
  }

  const isProductExists = await prisma.product.findFirst({
    where: {
      id,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
  });
  if (!isProductExists) {
    throw new ApiError(status.NOT_FOUND, "Product is Not found");
  }
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: req.user?.email,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const createRating = await tx.rating.upsert({
      where: {
        userId_productId: {
          userId: isUserExists.id,
          productId: isProductExists.id,
        },
      },
      update: {
        value: req.body.value,
        review: req.body.review,
      },
      create: {
        userId: isUserExists.id,
        productId: isProductExists.id,
        value: req.body.value,
        review: req.body.review,
      },
    });

    if (!createRating) {
      throw new ApiError(status.CONFLICT, "Rating has not been created");
    }

    const average = await tx.rating.aggregate({
      _avg: {
        value: true,
      },
      _count: {
        value: true,
      },
      where: {
        productId: isProductExists.id,
      },
    });

    const averageCount = new Decimal(average._count.value || 0);
    const averageRatting = new Decimal(average._avg.value || 0);

    const result = await tx.product.update({
      where: {
        id: isProductExists.id,
      },
      data: {
        rating: averageCount,
        averageRating: averageRatting,
      },
    });

    return result;
  });

  return result;
};
const getAllDataFromDB = async () => {
  const result = await prisma.rating.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
      product: true,
    },
  });
  return result;
};
const getByIdFromDB = async (id: string) => {
  const isProductExists = await prisma.product.findFirstOrThrow({
    where: {
      id,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.rating.findMany({
    where: {
      productId: isProductExists.id,
    },
    include: {
      user: {
        select: {
          admin: true,
          vendor: true,
          customer: true,
        },
      },
    },
  });
  return result;
};
const updateByIdIntoDB = () => {};
const deleteByIdFromDB = () => {};

export const ReviewServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
