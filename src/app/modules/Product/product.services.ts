import { Request } from "express";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { generateSku, generateSlug } from "../../../utils/slug/generateSlug";
import { Prisma, Product, ProductStatus } from "@prisma/client";
import { IPaginationOptions } from "../../../interface/pagination";
import { IProductFilterFields } from "./product.interface";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import { allowedSortOrder } from "../../../utils/pagination/pagination";
import { allowedProductSortAbleField } from "./product.constant";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";

const createDataIntoDB = async (req: Request): Promise<Product> => {
  const productData = req.body;
  const isSubCategoryIdExist = await prisma.subCategory.findFirst({
    where: {
      id: productData.subCategoryId,
      isDeleted: false,
    },
  });
  if (!isSubCategoryIdExist) {
    throw new ApiError(status.NOT_FOUND, "Sub Category is Not found");
  }
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: req.user?.email,
    },
  });

  if (isUserExists) {
    productData.sellerId = isUserExists.id;
  }

  if (req.files && Array.isArray(req.files)) {
    const uploadResult = await Promise.all(
      req.files.map((file) => sendImageToCloudinary(file))
    );

    const imageUrl = uploadResult.map(
      (result) => (result as ICloudinaryUploadResponse)?.secure_url
    );
    productData.productImages = imageUrl;
  }

  productData.slug = generateSlug(productData.name);
  // productData.sku

  const productCount = await prisma.product.count({
    where: {
      subCategoryId: isSubCategoryIdExist.id,
    },
  });

  productData.sku = generateSku(isSubCategoryIdExist.name, productCount);

  // return productData;

  const result = await prisma.product.create({ data: productData });
  return result;
};
const getAllDataFromDB = async (
  filters: IProductFilterFields,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = buildSortCondition(
    options,
    allowedProductSortAbleField,
    allowedSortOrder
  );

  const whereConditions = buildSearchAndFilterCondition<IProductFilterFields>(
    filters,
    ["name"]
  );

  const result = await prisma.product.findMany({
    where: {
      ...whereConditions,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
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
    include: {
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
  const total = await prisma.product.count({
    where: {
      ...whereConditions,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
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
const getByIdFromDB = async (id: string) => {
  const result = await prisma.product.findFirstOrThrow({
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

    include: {
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return result;
};

const updateByIdIntoDB = async (id: string, req: Request) => {
  const productData = req.body;
  if (productData.subCategoryId) {
    const isSubCategoryIdExist = await prisma.subCategory.findFirst({
      where: {
        id: productData.subCategoryId,
        isDeleted: false,
      },
    });
    if (!isSubCategoryIdExist) {
      throw new ApiError(status.NOT_FOUND, "Sub Category is Not found");
    }
  }

  if (productData.name) {
    const isProductExistsByName = await prisma.product.findFirst({
      where: {
        name: productData.name,
        status: {
          in: [
            ProductStatus.ACTIVE,
            ProductStatus.DISCONTINUED,
            ProductStatus.OUT_OF_STOCK,
          ],
        },
      },
    });

    if (isProductExistsByName) {
      throw new ApiError(status.CONFLICT, "Product name is already exists");
    }
    productData.slug = generateSlug(productData.name);
  }

  const existingProduct = await prisma.product.findUniqueOrThrow({
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

  if (!existingProduct) {
    throw new ApiError(status.NOT_FOUND, "Product is not found");
  }
  let updateImages = existingProduct.productImages || [];

  if (productData.removeImages && Array.isArray(productData.removeImages)) {
    updateImages = updateImages.filter(
      (img) => !productData.removeImages.includes(img)
    );
  }

  if (req.files && Array.isArray(req.files)) {
    const uploadResult = await Promise.all(
      req.files.map((file) => sendImageToCloudinary(file))
    );

    const imageUrl = uploadResult.map(
      (result) => (result as ICloudinaryUploadResponse)?.secure_url
    );
    updateImages = [...updateImages, ...imageUrl];
  }
  existingProduct.productImages = updateImages;

  const result = await prisma.product.update({
    where: {
      id: existingProduct.id,
    },
    data: existingProduct,
  });

  return result;
};

const softDeleteByIdFromDB = async (id: string) => {
  const isProductExists = await prisma.product.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const isStatusDelete =
    isProductExists.status === ProductStatus.ACTIVE
      ? ProductStatus.INACTIVE
      : ProductStatus.ACTIVE;

  const result = await prisma.product.update({
    where: {
      id: isProductExists.id,
    },
    data: {
      status: isStatusDelete,
    },
  });

  return result;
};

export const ProductServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  softDeleteByIdFromDB,
};
