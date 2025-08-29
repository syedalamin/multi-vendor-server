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

const createCategoryIntoDB = async (req: Request) => {
  const name = req.body.name;
  const isExistsName = await prisma.category.findFirst({
    where: {
      name: name,
      isDeleted: false,
    },
  });

  if (isExistsName) {
    throw new ApiError(status.FOUND, "Category is already exists");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;

    req.body.image = secure_url;
  }

  if (!req.body.image) {
    throw new ApiError(status.NOT_FOUND, "Upload a category picture");
  }
  const slug = generateSlug(name);

  const categoryData = {
    name,
    slug,
    image: req.body.image,
  };

  const result = await prisma.category.create({ data: categoryData });

  return result;
};
const getAllCategoryFromDB = async (
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

  const results = await prisma.category.findMany({
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

    include: {
      subCategory: {
        select: {
          id: true,
          name: true,
          image: true,
          categoryId: true,
          isDeleted: true,
        },
      },
    },
  });

  const total = await prisma.category.count({
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
  const result = await prisma.category.findFirstOrThrow({
    where: {
      slug,
      isDeleted: false,
    },
    include: {
      subCategory: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          categoryId: true,
          isDeleted: true,
        },
      },
    },
  });

  return result;
};
const updateByIdIntoDB = async (req: Request, id: string) => {
  const name = req.body.name;

  if (name) {
    const isExistsName = await prisma.category.findFirst({
      where: {
        name: name,
        isDeleted: false,
      },
    });

    if (isExistsName) {
      throw new ApiError(status.CONFLICT, "Category is already exists");
    }
  }

  const isExistsCategory = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExistsCategory) {
    throw new ApiError(status.NOT_FOUND, "Category is not found");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;

    req.body.image = secure_url;
  }

  const categoryData: Prisma.CategoryUpdateInput = {};
  if (name) {
    categoryData.name = name;
    categoryData.slug = generateSlug(name);
  } else if (req.body.image) {
    categoryData.image = req.body.image;
  }

  const result = await prisma.category.update({
    where: {
      id: isExistsCategory.id,
    },
    data: categoryData,
  });

  return result;
};

const softDeleteByIdFromDB = async (id: string) => {
  const isExistsCategory = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      subCategory: {
        select: {
          id: true,
          name: true,
          isDeleted: true,
        },
      },
    },
  });

  if (!isExistsCategory) {
    throw new ApiError(status.NOT_FOUND, "Category is not found");
  }
  const isExistsSubCategoryIds = isExistsCategory.subCategory.map(
    (category) => category.id
  );

  const isCategoryDeleted = isExistsCategory.isDeleted ? false : true;
  const result = await prisma.$transaction(async (transactionClient) => {
    const categoryDelete = await transactionClient.category.update({
      where: {
        id: isExistsCategory.id,
      },
      data: {
        isDeleted: isCategoryDeleted,
      },
      select: {
        name: true,
        isDeleted: true,
      },
    });

    let subCategoryDeleted;
    if (isExistsSubCategoryIds) {
      subCategoryDeleted = await transactionClient.subCategory.updateMany({
        where: {
          id: {
            in: isExistsSubCategoryIds,
          },
        },
        data: {
          isDeleted: isCategoryDeleted,
        },
      });
    }

    return { ...categoryDelete, ...subCategoryDeleted };
  });
  return result;
};

const deleteByIdFromDB = async (id: string) => {
  const isExistsCategory = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      subCategory: {
        select: {
          id: true,
          name: true,
          isDeleted: true,
        },
      },
    },
  });

  if (!isExistsCategory) {
    throw new ApiError(status.NOT_FOUND, "Category is not found");
  }
  const isExistsSubCategoryIds = isExistsCategory.subCategory.map(
    (category) => category.id
  );

  const result = await prisma.$transaction(async (transactionClient) => {
    let subCategoryDeleted;
    if (isExistsSubCategoryIds) {
      subCategoryDeleted = await transactionClient.subCategory.deleteMany({
        where: {
          id: {
            in: isExistsSubCategoryIds,
          },
        },
      });
    }
    const categoryDelete = await transactionClient.category.delete({
      where: {
        id: isExistsCategory.id,
      },
      select: {
        name: true,
      },
    });

    return { ...categoryDelete, ...subCategoryDeleted };
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getBySlugFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
  softDeleteByIdFromDB,
};
