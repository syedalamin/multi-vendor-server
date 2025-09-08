import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { UserRole, UserStatus } from "@prisma/client";

const getMyVendorMetaDataFromDB = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
      role: UserRole.VENDOR,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isOrderExists = await prisma.order.findMany({
    where: {
      sellerId: userInfo.id,
    },
    include: {
      orderItem: true,
    },
  });

  const orderSummary = await prisma.order.aggregate({
    where: {
      sellerId: userInfo.id,
    },
    _count: { id: true },
    _sum: { totalAmount: true, deliveryCharge: true },
  });

  const orderIds = isOrderExists.map((order) => order.id);

  const productSummary = await prisma.orderItem.groupBy({
    by: ["orderId"],
    where: { orderId: { in: orderIds } },
    _count: { productId: true },
    _sum: { quantity: true, price: true, discountPrice: true },
  });

  const totalProductSummary = productSummary.reduce(
    (acc, curr) => {
      acc._count.productId += curr._count.productId;
      acc._sum.quantity += curr._sum.quantity || 0;
      return acc;
    },
    {
      _count: { productId: 0 },
      _sum: { quantity: 0 },
    }
  );

  return { orderSummary, totalProductSummary };
};
const getAllAdminMetaDataFromDB = async () => {
  const allUser = await prisma.user.aggregate({
    _count: { id: true },
  });
  const allAdmin = await prisma.admin.aggregate({
    _count: { id: true },
  });
  const allVendor = await prisma.vendor.aggregate({
    _count: { id: true },
  });
  const allCustomer = await prisma.customer.aggregate({
    _count: { id: true },
  });

  const isOrderExists = await prisma.order.findMany({
    include: {
      orderItem: true,
    },
  });

  const orderSummary = await prisma.order.aggregate({
    _count: { id: true },
    _sum: { totalAmount: true, deliveryCharge: true },
  });

  const orderIds = isOrderExists.map((order) => order.id);

  const productSummary = await prisma.orderItem.groupBy({
    by: ["orderId"],
    where: { orderId: { in: orderIds } },
    _count: { productId: true },
    _sum: { quantity: true, price: true, discountPrice: true },
  });

  const totalProductSummary = productSummary.reduce(
    (acc, curr) => {
      acc._count.productId += curr._count.productId;
      acc._sum.quantity += curr._sum.quantity || 0;
      return acc;
    },
    {
      _count: { productId: 0 },
      _sum: { quantity: 0 },
    }
  );

  return {
    allUser,
    allAdmin,
    allVendor,
    allCustomer,
    orderSummary,
    totalProductSummary,
  };
};

export const VendorMetaServices = {
  getMyVendorMetaDataFromDB,
  getAllAdminMetaDataFromDB,
};
