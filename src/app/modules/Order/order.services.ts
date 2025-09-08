import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { OrderPaymentStatus, OrderStatus, Prisma, UserRole, UserStatus } from "@prisma/client";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { IShippingInfoRequest } from "./order.interface";

// const checkout = async (
//   user: JwtPayload,
//   shippingInfo: IShippingInfoRequest,
//   paymentType: any
// ) => {
//   const userInfo = await prisma.user.findFirstOrThrow({
//     where: {
//       email: user?.email,
//       status: UserStatus.ACTIVE,
//     },
//     select: {
//       id: true,
//       email: true,
//       role: true,
//       status: true,
//     },
//   });

//   const result = await prisma.$transaction(async (tx) => {
//     const isCartExists = await tx.cart.findMany({
//       where: {
//         userId: userInfo.id,
//       },
//       include: {
//         product: {
//           select: {
//             name: true,
//             productImages: true,
//             stock: true,
//           },
//         },
//       },
//     });

//     if (!isCartExists.length) {
//       throw new ApiError(status.BAD_REQUEST, "Cart is empty");
//     }

//     for (const item of isCartExists) {
//       if (item.quantity > item.product.stock) {
//         throw new ApiError(
//           status.BAD_REQUEST,
//           `Only ${item.product.stock} items are in stock, but you requested ${item.quantity}.`
//         );
//       }
//     }

//     const cartSummary = isCartExists.reduce(
//       (acc, item) => {
//         acc.totalItems += 1;
//         acc.totalQuantity += item.quantity;

//         if (Number(item.discountPrice) > 0) {
//           acc.totalDiscountPrice += Number(item.discountPrice);
//           acc.totalPrice += Number(item.price);
//         } else {
//           acc.totalDiscountPrice += Number(item.price);
//           acc.totalPrice += Number(item.price);
//         }

//         return acc;
//       },
//       { totalItems: 0, totalQuantity: 0, totalDiscountPrice: 0, totalPrice: 0 }
//     );

//     let deliveryCharge;
//     if (shippingInfo.districts.toLowerCase() != "dhaka") {
//       deliveryCharge = Number(130);
//     } else {
//       deliveryCharge = Number(80);
//     }

//     let finalAmount;
//     if (
//       cartSummary.totalDiscountPrice > 0 &&
//       cartSummary.totalDiscountPrice < cartSummary.totalPrice
//     ) {
//       finalAmount = cartSummary.totalDiscountPrice + deliveryCharge;
//     } else {
//       finalAmount = cartSummary.totalPrice + deliveryCharge;
//     }

//     const order = await tx.order.create({
//       data: {
//         userId: userInfo.id,
//         totalAmount: new Prisma.Decimal(finalAmount),
//         paymentType: paymentType,
//         paymentStatus: "PENDING",
//         status: "PENDING",
//         shippingInfo,
//         deliveryCharge: new Prisma.Decimal(deliveryCharge),
//       },
//     });

//     const orderItemsData = isCartExists.map((cart) => ({
//       orderId: order.id,
//       productId: cart.productId,
//       quantity: cart.quantity,
//       price: cart.price,
//       discountPrice: cart.discountPrice,
//     }));

//     const orderItem = await tx.orderItem.createMany({
//       data: orderItemsData,
//     });

//     for (const item of isCartExists) {
//       await tx.product.update({
//         where: { id: item.productId },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }

//     await tx.cart.deleteMany({ where: { userId: userInfo.id } });

//     return { order, orderItem };
//   });

//   return result;
// };

// const checkout = async (
//   user: JwtPayload,
//   shippingInfo: IShippingInfoRequest,
//   paymentType: any
// ) => {
//   const userInfo = await prisma.user.findFirstOrThrow({
//     where: {
//       email: user?.email,
//       status: UserStatus.ACTIVE,
//     },
//     select: { id: true, email: true },
//   });

//   const result = await prisma.$transaction(async (tx) => {
//     const cartItems = await tx.cart.findMany({
//       where: { userId: userInfo.id },
//       include: {
//         product: {
//           select: {
//             id: true,
//             sellerId: true,
//             name: true,
//             stock: true,
//             price: true,
//             discount: true,
//           },
//         },
//       },
//     });

//     if (!cartItems.length) {
//       throw new ApiError(status.BAD_REQUEST, "Cart is empty");
//     }

//     // group by vendor
//     const vendorGroups: Record<string, typeof cartItems> = {};
//     for (const item of cartItems) {
//       const vendorId = item.product.sellerId;
//       if (!vendorGroups[vendorId]) {
//         vendorGroups[vendorId] = [];
//       }
//       vendorGroups[vendorId].push(item);
//     }

//     const vendorOrders = [];

//     // vendor-wise order create
//     for (const [vendorId, items] of Object.entries(vendorGroups)) {

//       // validation
//       for (const item of items) {
//         if (item.quantity > item.product.stock) {
//           throw new ApiError(
//             status.BAD_REQUEST,
//             `Only ${item.product.stock} items are in stock for ${item.product.name}`
//           );
//         }
//       }

//       // calculate summary
//       const summary = items.reduce(
//         (acc, item) => {
//           acc.totalPrice += Number(item.product.price) * item.quantity;
//           acc.totalDiscountPrice +=
//             Number(item.product.discount) > 0
//               ? Number(item.product.discount) * item.quantity
//               : Number(item.product.price) * item.quantity;
//           return acc;
//         },
//         { totalPrice: 0, totalDiscountPrice: 0 }
//       );

//       const deliveryCharge =
//         shippingInfo.districts.toLowerCase() !== "dhaka" ? 130 : 80;

//       const finalAmount =
//         summary.totalDiscountPrice < summary.totalPrice
//           ? summary.totalDiscountPrice + deliveryCharge
//           : summary.totalPrice + deliveryCharge;

//       const order = await tx.order.create({
//         data: {
//           userId: userInfo.id,
//           sellerId : vendorId ,
//           totalAmount: new Prisma.Decimal(finalAmount),
//           paymentType,
//           paymentStatus: "PENDING",
//           status: "PENDING",
//           shippingInfo,
//           deliveryCharge: new Prisma.Decimal(deliveryCharge),
//         },
//       });

//       const orderItemsData = items.map((cart) => ({
//         orderId: order.id,
//         productId: cart.productId,
//         quantity: cart.quantity,
//         price: cart.product.price,
//         discountPrice: cart.product.discount,
//       }));

//       await tx.orderItem.createMany({ data: orderItemsData });

//       // stock update
//       for (const item of items) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }

//       vendorOrders.push({
//         order,
//         orderItems: items.map((i) => ({
//           productId: i.product.id,
//           productName: i.product.name,
//           quantity: i.quantity,
//           price: i.product.price,
//           discountPrice: i.product.discount,
//         })),
//       });
//     }

//     // clear cart
//     await tx.cart.deleteMany({ where: { userId: userInfo.id } });

//     return {
//       mainOrderId: vendorOrders[0].order.id, // reference id
//       totalVendors: vendorOrders.length,
//       totalOrders: vendorOrders.map((o) => o.order.id),
//       orders: vendorOrders,
//     };
//   });

//   return result;
// };

const checkout = async (
  user: JwtPayload,
  shippingInfo: IShippingInfoRequest,
  paymentType: any
) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: { email: user?.email, status: UserStatus.ACTIVE },
    select: { id: true, email: true },
  });

  const result = await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cart.findMany({
      where: { userId: userInfo.id },
      include: {
        product: {
          select: {
            id: true,
            sellerId: true,
            name: true,
            stock: true,
            price: true,
            discount: true,
          },
        },
      },
    });

    if (!cartItems.length) {
      throw new ApiError(status.BAD_REQUEST, "Cart is empty");
    }

    // group by vendor
    const vendorGroups: Record<string, typeof cartItems> = {};
    for (const item of cartItems) {
      const vendorId = item.product.sellerId;
      if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
      vendorGroups[vendorId].push(item);
    }

    const vendorOrders = [];

    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      // validation
      for (const item of items) {
        if (item.quantity > item.product.stock) {
          throw new ApiError(
            status.BAD_REQUEST,
            `Only ${item.product.stock} items are in stock for ${item.product.name}`
          );
        }
      }

      // calculate per item discount
      const orderItemsData = items.map((cart) => {
        const price = Number(cart.product.price);
        const discountPercent = Number(cart.product.discount);

        const discountAmount =
          discountPercent > 0 ? (price * discountPercent) / 100 : 0; 
        const totalPriceWithoutDiscount = price * cart.quantity; 
        const totalDiscountAmount = discountAmount * cart.quantity; 
        const totalPriceAfterDiscount =
          totalPriceWithoutDiscount - totalDiscountAmount; 

        return {
          productId: cart.productId,
          quantity: cart.quantity,
          price, 
          discountAmount, 
          totalPriceAfterDiscount,
          totalDiscountAmount, 
        };
      });
      const totalPrice = orderItemsData.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const totalDiscount = orderItemsData.reduce(
        (acc, item) => acc + item.totalDiscountAmount,
        0
      );

      const deliveryCharge =
        shippingInfo.districts.toLowerCase() !== "dhaka" ? 130 : 80;

      const finalAmount = totalPrice - totalDiscount + deliveryCharge;

      const order = await tx.order.create({
        data: {
          userId: userInfo.id,
          sellerId: vendorId,
          totalAmount: new Prisma.Decimal(finalAmount),
          paymentType,
          paymentStatus: "PENDING",
          status: "PENDING",
          shippingInfo,
          deliveryCharge: new Prisma.Decimal(deliveryCharge),
        },
      });

      // save order items
      await tx.orderItem.createMany({
        data: orderItemsData.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.discountAmount,
        })),
      });

      // update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      vendorOrders.push({
        order,
        orderItems: orderItemsData.map((item, idx) => ({
          productId: item.productId,
          productName: items[idx].product.name,
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.discountAmount,
        })),
      });
    }

    // clear cart
    await tx.cart.deleteMany({ where: { userId: userInfo.id } });

    return {
      mainOrderId: vendorOrders[0].order.id,
      totalVendors: vendorOrders.length,
      totalOrders: vendorOrders.map((o) => o.order.id),
      orders: vendorOrders,
    };
  });

  return result;
};

const getAllDataFromDB = async (user: JwtPayload) => {
  await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  const isOrderExists = await prisma.order.findMany({
    select: {
      id: true,
      userId: true,
      totalAmount: true,
      paymentStatus: true,
      paymentType: true,
      status: true,
      deliveryCharge: true,
      shippingInfo: true,
      orderItem: true,
    },
  });

  return isOrderExists;
};

const getMyVendorDataFromDB = async (user: JwtPayload) => {
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
      sellerId: userInfo.id
    },
    include: {
      orderItem: true,
    },
  });

  return isOrderExists;
};


const getMyDataFromDB = async (user: JwtPayload) => {
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
  const isOrderExists = await prisma.order.findMany({
    where: {
      userId: userInfo.id,
    },
    include: {
      orderItem: true,
    },
  });

  return isOrderExists;
};

const getByIdFromDB = async (user: JwtPayload, id: string) => {
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

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  const isOrderExists = await prisma.order.findFirstOrThrow({
    where: {
      id: id,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
  });

  return isOrderExists;
};

const orderStatus = (current: string, payload: OrderStatus) => {
  if (current === payload) {
    throw new ApiError(status.CONFLICT, `Same status no update needed`);
  }

  if (current === OrderStatus.DELIVERED || current === OrderStatus.CANCELLED) {
    throw new ApiError(
      status.CONFLICT,
      `Order already ${current}, can't change `
    );
  }

  if (
    current === OrderStatus.PENDING &&
    (payload === OrderStatus.SHIPPED || payload === OrderStatus.CANCELLED)
  ) {
    return true;
  }
  if (current === OrderStatus.SHIPPED && payload === OrderStatus.DELIVERED) {
    return true;
  }
};

const updateStatusByIdIntoDB = async (
  id: string,
  payload: { status: OrderStatus }
) => {
  const isOrderExists = await prisma.order.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!orderStatus(isOrderExists.status, payload.status)) {
    throw new ApiError(
      status.CONFLICT,
      `Invalid status transition from ${isOrderExists.status} to ${payload.status}`
    );
  }

  const updateStatus = await prisma.order.update({
    where: {
      id: isOrderExists.id,
    },
    data: payload,
  });

  return updateStatus;
};
const orderPaymentStatus = (current: string, payload: OrderPaymentStatus) => {
  if (current === payload) {
    throw new ApiError(status.CONFLICT, `Same status no update needed`);
  }

  if (current === OrderPaymentStatus.FAILED || current === OrderPaymentStatus.PAID) {
    throw new ApiError(
      status.CONFLICT,
      `Order already ${current}, can't change `
    );
  }

  if (
    current === OrderPaymentStatus.PENDING &&
    (payload === OrderPaymentStatus.PAID || payload === OrderPaymentStatus.FAILED)
  ) {
    return true;
  }

};

const updatePaymentStatusByIdIntoDB = async (
  id: string,
  payload: { paymentStatus: OrderPaymentStatus }
) => {
  const isOrderExists = await prisma.order.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      paymentStatus: true
    },
  });

  if (!orderPaymentStatus(isOrderExists.paymentStatus, payload.paymentStatus)) {
    throw new ApiError(
      status.CONFLICT,
      `Invalid status transition from ${isOrderExists.paymentStatus} to ${payload.paymentStatus}`
    );
  }

  const updateStatus = await prisma.order.update({
    where: {
      id: isOrderExists.id,
    },
    data: payload,
  });

  return updateStatus;
};

const deleteByIdFromDB = () => {};

export const OrderServices = {
  checkout,
  getAllDataFromDB,
  getByIdFromDB,
  updateStatusByIdIntoDB,
  deleteByIdFromDB,
  getMyDataFromDB,
  getMyVendorDataFromDB,
  updatePaymentStatusByIdIntoDB
};
