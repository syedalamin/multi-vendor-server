import { Request } from "express";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";

const createCityIntoDB = async (req: Request) => {
  const { name, districtId } = req.body;

  if (!districtId) {
    throw new ApiError(status.BAD_REQUEST, "districtId is required");
  }

  const isExistsName = await prisma.city.findFirst({
    where: {
      name,
      districtId,
    },
  });

  if (isExistsName) {
    throw new ApiError(status.CONFLICT, "City already exists in this district");
  }

  const result = await prisma.city.create({
    data: {
      name,
      districtId,
    },
  });

  return result;
};

const getAllCityFromDB = async () => {
  const results = await prisma.city.findMany({});
  return results;
};

const getCityByDistrictIdFromDB = async (districtId: string) => {
  const result = await prisma.city.findMany({
    where: {
      districtId,
    },
  });

  return result;
};


const getByIdFromDB = async (id: string) => {
  const result = await prisma.city.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateByIdIntoDB = async (req: Request, id: string) => {
  const { name, districtId } = req.body;

  if (!districtId) {
    throw new ApiError(status.BAD_REQUEST, "districtId is required");
  }

  const isExistsCity = await prisma.city.findFirst({
    where: {
      id: id,
      districtId: districtId,
    },
  });

  const result = await prisma.city.update({
    where: {
      id: isExistsCity?.id,
      districtId: isExistsCity?.districtId,
    },
    data: {
      name,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string) => {
  const isExistsCity = await prisma.city.findUnique({
    where: {
      id,
    },
  });

  if (!isExistsCity) {
    throw new ApiError(status.NOT_FOUND, "District is not found");
  }

  const result = await prisma.city.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CityServices = {
  createCityIntoDB,
  getAllCityFromDB,
  getByIdFromDB,
  deleteByIdFromDB,
  updateByIdIntoDB,
  getCityByDistrictIdFromDB
};
