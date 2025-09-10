import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { OrderPaymentStatus, UserRole, UserStatus } from "@prisma/client";

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

  const pendingSummary = await prisma.order.aggregate({
    where: {
      sellerId: userInfo.id,
      paymentStatus: OrderPaymentStatus.PENDING,
    },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  const paidSummary = await prisma.order.aggregate({
    where: {
      sellerId: userInfo.id,
      paymentStatus: OrderPaymentStatus.PAID,
    },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  const failedSummary = await prisma.order.aggregate({
    where: {
      sellerId: userInfo.id,
      paymentStatus: OrderPaymentStatus.FAILED,
    },
    _count: { id: true },
    _sum: { totalAmount: true },
  });

  const orderSummary = await prisma.order.aggregate({
    where: {
      sellerId: userInfo.id,
    },
    _count: { id: true },
    _sum: { totalAmount: true, deliveryCharge: true },
  });

  const pendingOrderIds = isOrderExists
    .filter((order) => order.paymentStatus === OrderPaymentStatus.PENDING)
    .map((order) => order.id);

  const paidOrderIds = isOrderExists
    .filter((order) => order.paymentStatus === OrderPaymentStatus.PAID)
    .map((order) => order.id);

  const failedOrderIds = isOrderExists
    .filter((order) => order.paymentStatus === OrderPaymentStatus.FAILED)
    .map((order) => order.id);

  const getProductSummaryByOrderIds = async (orderIds: string[]) => {
    const summary = await prisma.orderItem.groupBy({
      by: ["orderId"],
      where: { orderId: { in: orderIds } },
      _count: { productId: true },
      _sum: { quantity: true },
    });

    return summary.reduce(
      (acc, curr) => {
        acc._count.productId += curr._count.productId;
        acc._sum.quantity += curr._sum.quantity || 0;
        return acc;
      },
      { _count: { productId: 0 }, _sum: { quantity: 0 } }
    );
  };

  const pendingProductSummary = await getProductSummaryByOrderIds(
    pendingOrderIds
  );
  const paidProductSummary = await getProductSummaryByOrderIds(paidOrderIds);
  const failedProductSummary = await getProductSummaryByOrderIds(
    failedOrderIds
  );

  return {
    pendingSummary,
    paidSummary,
    failedSummary,
    orderSummary,
    pendingProductSummary,
    paidProductSummary,
    failedProductSummary,
  };
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
    include: { orderItem: true },
  });


  const pendingSummary = await prisma.order.aggregate({
    where: { paymentStatus: OrderPaymentStatus.PENDING },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  const paidSummary = await prisma.order.aggregate({
    where: { paymentStatus: OrderPaymentStatus.PAID },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  const failedSummary = await prisma.order.aggregate({
    where: { paymentStatus: OrderPaymentStatus.FAILED },
    _count: { id: true },
    _sum: { totalAmount: true },
  });


  const orderSummary = await prisma.order.aggregate({
    _count: { id: true },
    _sum: { totalAmount: true, deliveryCharge: true },
  });


  const pendingOrderIds = isOrderExists
    .filter((order) => order.paymentStatus === OrderPaymentStatus.PENDING)
    .map((order) => order.id);

  const paidOrderIds = isOrderExists
    .filter((order) => order.paymentStatus === OrderPaymentStatus.PAID)
    .map((order) => order.id);

  const failedOrderIds = isOrderExists
    .filter((order) => order.paymentStatus === OrderPaymentStatus.FAILED)
    .map((order) => order.id);


  const getProductSummaryByOrderIds = async (orderIds: string[]) => {
    const summary = await prisma.orderItem.groupBy({
      by: ["orderId"],
      where: { orderId: { in: orderIds } },
      _count: { productId: true },
      _sum: { quantity: true, price: true, discountPrice: true },
    });

    return summary.reduce(
      (acc, curr) => {
        acc._count.productId += curr._count.productId;
        acc._sum.quantity += curr._sum.quantity || 0;
        return acc;
      },
      { _count: { productId: 0 }, _sum: { quantity: 0 } }
    );
  };


  const pendingProductSummary = await getProductSummaryByOrderIds(pendingOrderIds);
  const paidProductSummary = await getProductSummaryByOrderIds(paidOrderIds);
  const failedProductSummary = await getProductSummaryByOrderIds(failedOrderIds);

  return {
    allUser,
    allAdmin,
    allVendor,
    allCustomer,
    orderSummary,
    pendingSummary,
    paidSummary,
    failedSummary,
    pendingProductSummary,
    paidProductSummary,
    failedProductSummary,
  };
};


export const VendorMetaServices = {
  getMyVendorMetaDataFromDB,
  getAllAdminMetaDataFromDB,
};
