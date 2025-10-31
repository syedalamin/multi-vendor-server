import { ProductStatus, UserStatus, Vendor } from "@prisma/client";
import { IPaginationOptions } from "../../../interface/pagination";
import { allowedSortOrder } from "../../../utils/pagination/pagination";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import prisma from "../../../utils/share/prisma";
import {
  allowedVendorSortFields,
  vendorSearchAbleFields,
} from "./vendor.constant";
import { IVendorFilterRequest } from "./vendor.interface";
import { Request } from "express";
import status from "http-status";
import ApiError from "../../../utils/share/apiError";

import { generateSlug } from "../../../utils/slug/generateSlug";
import sendShopImageToCPanel from "../../../utils/sendShopImageToCPanel";

const getAllDataFromDB = async (
  filters: IVendorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = buildSortCondition(
    options,
    allowedVendorSortFields,
    allowedSortOrder
  );
  // search

  const whereConditions = buildSearchAndFilterCondition<IVendorFilterRequest>(
    filters,
    vendorSearchAbleFields
  );

  // console.log(searchTerm, filterData)
  const result = await prisma.vendor.findMany({
    where: {
      isBlocked: false,
      ...whereConditions,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.vendor.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Vendor> => {
  const result = await prisma.vendor.findFirstOrThrow({
    where: {
      id: id,
      isBlocked: false,
    },
  });

  return result;
};
const getBySlugFromDB = async (slug: string): Promise<Vendor> => {
  const result = await prisma.vendor.findFirstOrThrow({
    where: {
      shopSlug: slug,
      isBlocked: false,
      isVerified: true,
    },

    include: {
      user: {
        select: {
          product: {
            where: {
              status: {
                in: [
                  ProductStatus.ACTIVE,
                  ProductStatus.DISCONTINUED,
                  ProductStatus.OUT_OF_STOCK,
                ],
              },
            },
          },
        },
      },
    },
  });

  return result;
};

const updateByIdIntoDB = async (id: string, req: Request) => {
  const vendorData = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const isVendorExist = await prisma.vendor.findFirst({
    where: {
      id,

      isBlocked: false,
    },
  });
  if (!isVendorExist) {
    throw new ApiError(status.NOT_FOUND, "Vendor is not found");
  }

  if (vendorData.shopName) {
    const slug = generateSlug(vendorData.shopName);
    const isExistsShopName = await prisma.vendor.findUnique({
      where: {
        shopSlug: slug,
        NOT: {
          id: id,
        },
      },
    });

    if (isExistsShopName) {
      throw new ApiError(status.CONFLICT, "Shop name is already exists");
    } else {
      vendorData.shopSlug = slug;
    }
  }

  if (req.files) {
    if (files.logo) {
      const imageUrl = sendShopImageToCPanel(req);
      const imageString = imageUrl.logo[0];

      vendorData.logo = imageString;
    }
    if (files.banner) {
      const imageUrl = sendShopImageToCPanel(req);
      const imageString = imageUrl.banner[0];
      vendorData.banner = imageString;
    }
  }

  const result = await prisma.vendor.update({
    where: {
      id: isVendorExist.id,
    },
    data: vendorData,
  });

  return result;
};

const verifyUpdateByIdIntoDB = async (id: string) => {
  const isVendorExist = await prisma.vendor.findFirst({
    where: {
      id,
      isBlocked: false,
    },
    include: {
      user: true,
    },
  });
  if (!isVendorExist) {
    throw new ApiError(status.NOT_FOUND, "Vendor is not found");
  }

  const isExistsShopProduct = await prisma.product.findMany({
    where: {
      sellerId: isVendorExist.id,
    },
  });

  if (isExistsShopProduct) {
    await prisma.product.updateMany({
      where: {
        sellerId: isVendorExist.user.id,
      },
      data: {
        status: ProductStatus.ACTIVE,
      },
    });
  }

  const result = await prisma.vendor.update({
    where: {
      id: isVendorExist.id,
    },
    data: {
      isVerified: true,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string) => {
  const isVendorExist = await prisma.vendor.findFirst({
    where: {
      id,
    },
  });
  if (!isVendorExist) {
    throw new ApiError(status.NOT_FOUND, "Vendor is not found");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const result = await transactionClient.vendor.delete({
      where: {
        email: isVendorExist.email,
      },
    });

    await transactionClient.user.delete({
      where: { email: isVendorExist.email },
    });

    return result;
  });

  return result;
};

const softDeleteByIdFromDB = async (id: string) => {
  const isVendorExist = await prisma.vendor.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  if (!isVendorExist) {
    throw new ApiError(status.NOT_FOUND, "Vendor is not found");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.product.updateMany({
      where: {
        sellerId: isVendorExist.user.id,
      },
      data: {
        status: ProductStatus.INACTIVE,
      },
    });
    const result = await transactionClient.vendor.update({
      where: {
        id: isVendorExist.id,
      },
      data: {
        isVerified: false,
      },
    });
    return result;
  });

  return result;
};

export const VendorServices = {
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
  verifyUpdateByIdIntoDB,
  softDeleteByIdFromDB,
  getBySlugFromDB,
};
