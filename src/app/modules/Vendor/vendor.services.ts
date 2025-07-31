import { UserStatus, Vendor } from "@prisma/client";
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
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import { generateSlug } from "../../../utils/slug/generateSlug";

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
      },
    });

    if (isExistsShopName) {
      throw new ApiError(status.CONFLICT, "Shop name is already exists");
    } else {
      vendorData.shopSlug = slug;
    }
  }

  if (files) {
    if (files.logo) {
      const uploadResult = await Promise.all(
        files.logo.map((file) => sendImageToCloudinary(file))
      );

      const imageUrl = uploadResult.map(
        (result) => (result as ICloudinaryUploadResponse)?.secure_url
      );
      vendorData.logo = imageUrl[0];
    }
    if (files.banner) {
      const uploadResult = await Promise.all(
        files.banner.map((file) => sendImageToCloudinary(file))
      );

      const imageUrl = uploadResult.map(
        (result) => (result as ICloudinaryUploadResponse)?.secure_url
      );
      vendorData.banner = imageUrl[0];
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

const deleteByIdFromDB = () => {};

export const VendorServices = {
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
