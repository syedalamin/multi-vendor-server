import { Vendor } from "@prisma/client";
import { IPaginationOptions } from "../../../interface/pagination";
import { allowedSortOrder } from "../../../utils/pagination/pagination";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import prisma from "../../../utils/share/prisma";
import { allowedVendorSortFields, vendorSearchAbleFields } from "./vendor.constant";
import { IVendorFilterRequest } from "./vendor.interface";

const getAllDataFromDB = async (filters: IVendorFilterRequest, options: IPaginationOptions) => {
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



const getByIdFromDB = async(id: string): Promise<Vendor> => {
  const result = await prisma.vendor.findFirstOrThrow({
    where: {
      id: id,
      isBlocked: false,
    },
  });

  return result;
};
const updateByIdIntoDB = () => {};
const deleteByIdFromDB = () => {};

export const VendorServices = {
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
