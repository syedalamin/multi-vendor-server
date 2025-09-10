import { Request } from "express";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";

const createDistrictIntoDB = async (req: Request) => {
  const { name } = req.body;
  const isExistsName = await prisma.district.findFirst({
    where: {
      name,
    },
  });

  if (isExistsName) {
    throw new ApiError(status.CONFLICT, "District is already exists");
  }

  const result = await prisma.district.create({ data: { name } });

  return result;
};

const getAllDistrictFromDB = async () => {
  const results = await prisma.district.findMany({
    include: {
      city: true,
    },
  });
  return results;
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.district.findUnique({
    where: {
      id,
    },
    include: {
      city: true,
    },
  });

  return result;
};

const updateByIdIntoDB = async (req: Request, id: string) => {
  const { name } = req.body;

  const isExistsName = await prisma.district.findFirst({
    where: {
      name,
    },
  });

  if (isExistsName) {
    throw new ApiError(status.CONFLICT, "District is already exists");
  }
  const result = await prisma.district.update({
    where: {
      id,
    },
    data: { name },
  });

  return result;
};

const deleteByIdFromDB = async (id: string) => {
  const isExistsDistrict = await prisma.district.findUnique({
    where: {
      id,
    },
  });

  if (!isExistsDistrict) {
    throw new ApiError(status.NOT_FOUND, "District is not found");
  }

  const result = await prisma.district.delete({
    where: {
      id,
    },
  });
  return result;
};

export const DistrictServices = {
  createDistrictIntoDB,
  getAllDistrictFromDB,
  deleteByIdFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
};
