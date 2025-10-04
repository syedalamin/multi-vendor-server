import { ProductStatus, UserRole } from "@prisma/client";
import { Request } from "express";
import status from "http-status";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import { IPaginationOptions } from "../../../interface/pagination";
import { allowedSortOrder } from "../../../utils/pagination/pagination";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import ApiError from "../../../utils/share/apiError";
import prisma from "../../../utils/share/prisma";
import { generateSku, generateSlug } from "../../../utils/slug/generateSlug";
import { allowedProductSortAbleField } from "./product.constant";
import { IProductFilterFields } from "./product.interface";

import { JwtPayload } from "jsonwebtoken";
import sendImagesToCPanel from "../../../utils/sendImagesToCPanel";
import deleteImagesFromCPanel from "../../../utils/deleteImagesFromCPanel";

const createDataIntoDB = async (req: Request) => {
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
    const imageUrl = await sendImagesToCPanel(req);

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

const getAllMyDataFromDB = async (
  filters: IProductFilterFields,
  options: IPaginationOptions,
  user: JwtPayload
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

  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      role: UserRole.VENDOR,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  const result = await prisma.product.findMany({
    where: {
      ...whereConditions,
      sellerId: userInfo.id,
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
      sellerId: userInfo.id,
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

const getBySlugFromDB = async (slug: string) => {
  const result = await prisma.product.findFirstOrThrow({
    where: {
      slug,
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
const getByIdsFromDB = async (req: Request) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("ids must be a non-empty array");
  }

  const result = await prisma.product.findMany({
    where: {
      id: { in: ids },
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
    },
  });

  if (!existingProduct) {
    throw new ApiError(status.NOT_FOUND, "Product is not found");
  }

  let updateImages = existingProduct.productImages || [];

  if (productData.removeImages && Array.isArray(productData.removeImages)) {
    await deleteImagesFromCPanel(productData.removeImages);
    updateImages = updateImages.filter(
      (img) => !productData.removeImages.includes(img)
    );
  }

  if (req.files && Array.isArray(req.files)) {
    const imageUrl = await sendImagesToCPanel(req);

    updateImages = [...updateImages, ...imageUrl];
  }

  if (productData.stock > 0) {
    productData.status = ProductStatus.ACTIVE;
  } else if (productData.stock < 1) {
    productData.status = ProductStatus.OUT_OF_STOCK;
  }

  const { removeImages, ...otherProductData } = productData;
  const updatedData = {
    ...otherProductData,
    productImages: updateImages,
  };

  const result = await prisma.product.update({
    where: {
      id: existingProduct.id,
    },
    data: updatedData,
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

const relatedProducts = async (id: string) => {
  const isProductExists = await prisma.product.findUniqueOrThrow({
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
    throw new ApiError(status.NOT_FOUND, "Product is not found");
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      subCategoryId: isProductExists.subCategoryId,
      NOT: { id: isProductExists.id },
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
    orderBy: { id: "desc" },
    take: 4,
  });

  return relatedProducts;
};
export const ProductServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getBySlugFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  softDeleteByIdFromDB,

  relatedProducts,
  getByIdsFromDB,
  getAllMyDataFromDB,
};
