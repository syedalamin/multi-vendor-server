import { Request } from "express";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import { generateSlug } from "../../../utils/slug/generateSlug";
import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interface/pagination";
import { allowedSortOrder } from "../../../utils/pagination/pagination";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";
import sendToCPanel from "../../../utils/sendCPanel";

const createSubCategoryIntoDB = async (req: Request) => {
  const name = req.body.name;
  const categoryId = req.body.categoryId;
  const isExistsName = await prisma.subCategory.findFirst({
    where: {
      name: name,
      isDeleted: false,
    },
  });

  if (isExistsName) {
    throw new ApiError(status.FOUND, "Sub Category is already exists");
  }

  const isCategoryIdExists = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!isCategoryIdExists) {
    throw new ApiError(status.NOT_FOUND, "Category is not found");
  }

  // if (req.file) {
  //   const { secure_url } = (await sendImageToCloudinary(
  //     req.file
  //   )) as ICloudinaryUploadResponse;

  //   req.body.image = secure_url;
  // }

  if (req.file) {
    const fileUrl = sendToCPanel(req);

    req.body.image = fileUrl;
  }

  if (!req.body.image) {
    throw new ApiError(status.NOT_FOUND, "Upload a category picture");
  }
  const slug = generateSlug(name);

  const subCategoryData: Prisma.SubCategoryUncheckedCreateInput = {
    name,
    slug,
    image: req.body.image,
    categoryId: isCategoryIdExists.id,
  };

  const result = await prisma.subCategory.create({ data: subCategoryData });

  return result;
};
const getAllSubCategoryFromDB = async (
  filters: { searchTerm?: string | undefined },
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = buildSortCondition(
    options,
    ["name"],
    allowedSortOrder
  );
  const whereConditions = buildSearchAndFilterCondition<{
    searchTerm?: string | undefined;
  }>(filters, ["name"]);

  const results = await prisma.subCategory.findMany({
    where: whereConditions,
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

  const total = await prisma.subCategory.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: results,
  };
};
const getBySlugFromDB = async (slug: string) => {
  const result = await prisma.subCategory.findFirstOrThrow({
    where: {
      slug,
      isDeleted: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
      },
      product: true,
    },
  });

  return result;
};
const updateByIdIntoDB = async (req: Request, id: string) => {
  const name = req.body.name;

  if (name) {
    const isExistsName = await prisma.subCategory.findFirst({
      where: {
        name: name,
        isDeleted: false,
      },
    });

    if (isExistsName) {
      throw new ApiError(status.CONFLICT, "Sub Category is already exists");
    }
  }

  const isExistsSubCategory = await prisma.subCategory.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExistsSubCategory) {
    throw new ApiError(status.NOT_FOUND, "Sub Category is not found");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;

    req.body.image = secure_url;
  }

  const subCategoryData: Prisma.SubCategoryUpdateInput = {};
  if (name) {
    subCategoryData.name = name;
    subCategoryData.slug = generateSlug(name);
  } else if (req.body.image) {
    subCategoryData.image = req.body.image;
  }

  const result = await prisma.subCategory.update({
    where: {
      id: isExistsSubCategory.id,
    },
    data: subCategoryData,
  });

  return result;
};
const softDeleteByIdFromDB = async (id: string) => {
  const isExistsSubCategory = await prisma.subCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExistsSubCategory) {
    throw new ApiError(status.NOT_FOUND, "Sub Category is not found");
  }
  const newIsDeleted = isExistsSubCategory.isDeleted ? false : true;

  const result = await prisma.subCategory.update({
    where: {
      id: isExistsSubCategory.id,
    },
    data: {
      isDeleted: newIsDeleted,
    },
  });

  return result;
};
const deleteByIdFromDB = async (id: string) => {
  const isExistsSubCategory = await prisma.subCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExistsSubCategory) {
    throw new ApiError(status.NOT_FOUND, "Sub Category is not found");
  }

  const result = await prisma.subCategory.delete({
    where: {
      id: isExistsSubCategory.id,
    },
  });

  return result;
};

export const SubCategoryServices = {
  createSubCategoryIntoDB,
  getAllSubCategoryFromDB,
  getBySlugFromDB,
  updateByIdIntoDB,
  softDeleteByIdFromDB,
  deleteByIdFromDB,
};
