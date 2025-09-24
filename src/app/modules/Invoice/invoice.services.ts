import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { UserStatus } from "@prisma/client";

const createDataIntoDB = () => {};

const getAllDataFromDB = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isInvoiceExists = await prisma.invoice.findMany({
    where: {
      userId: userInfo.id,
    },
  });

  return isInvoiceExists;
};
const getLastDataFromDB = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isInvoiceExists = await prisma.invoice.findFirst({
    where: {
      userId: userInfo.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include:{
      orderItems: true,
    }
  });

  return isInvoiceExists;
};
const updateByIdIntoDB = () => {};
const deleteByIdFromDB = () => {};

export const InvoiceServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getLastDataFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
