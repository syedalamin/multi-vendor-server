import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/share/prisma";
import { OrderPaymentStatus, UserRole, UserStatus } from "@prisma/client";
import { Request } from "express";

import sendShopImageToCPanel from "../../../utils/sendShopImageToCPanel";
import deleteImagesFromCPanel from "../../../utils/deleteImagesFromCPanel";
import { Decimal } from "@prisma/client/runtime/library";

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

  const pendingProductSummary = await getProductSummaryByOrderIds(
    pendingOrderIds
  );
  const paidProductSummary = await getProductSummaryByOrderIds(paidOrderIds);
  const failedProductSummary = await getProductSummaryByOrderIds(
    failedOrderIds
  );

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

// const createHomePageImages = async (req: Request) => {
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//   let homePageData = req.body;

//   const existingImage = await prisma.homePageImages.findUniqueOrThrow({
//     where: {
//       id: "home_page_single_entry",
//     },
//   });

//
//   let reviewMainImages = existingImage.reviewMainImages || [];
//   let footerImages = existingImage.footerImages || [];

//   if (
//     homePageData.removeFooterImages &&
//     Array.isArray(homePageData.removeFooterImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeFooterImages);
//     footerImages = footerImages.filter(
//       (img) => !homePageData.removeFooterImages.includes(img)
//     );
//   } else if (
//     homePageData.removeReviewMainImages &&
//     Array.isArray(homePageData.removeReviewMainImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeReviewMainImages);
//     reviewMainImages = reviewMainImages.filter(
//       (img) => !homePageData.removeReviewMainImages.includes(img)
//     );
//   } else if (
//     homePageData.removeReviewImages &&
//     Array.isArray(homePageData.removeReviewImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeReviewImages);
//     reviewImages = reviewImages.filter(
//       (img) => !homePageData.removeReviewImages.includes(img)
//     );
//   } else if (
//     homePageData.removeHotMainImages &&
//     Array.isArray(homePageData.removeHotMainImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeHotMainImages);
//     hotMainImages = hotMainImages.filter(
//       (img) => !homePageData.removeHotMainImages.includes(img)
//     );
//   } else if (
//     homePageData.removeHotDealImages &&
//     Array.isArray(homePageData.removeHotDealImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeHotDealImages);
//     hotDealImages = hotDealImages.filter(
//       (img) => !homePageData.removeHotDealImages.includes(img)
//     );
//   } else if (
//     homePageData.removeHeroImages &&
//     Array.isArray(homePageData.removeHeroImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeHeroImages);
//     heroImages = heroImages.filter(
//       (img) => !homePageData.removeHeroImages.includes(img)
//     );
//   } else if (
//     homePageData.removeSliderImages &&
//     Array.isArray(homePageData.removeSliderImages)
//   ) {
//     await deleteImagesFromCPanel(homePageData.removeSliderImages);
//     sliderImages = sliderImages.filter(
//       (img) => !homePageData.removeSliderImages.includes(img)
//     );
//   }

//   if (req.files) {
//     if (files.sliderImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       sliderImages = [...sliderImages, ...imageUrl.sliderImages];
//     } else if (files.heroImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       heroImages = [...heroImages, ...imageUrl.heroImages];
//     } else if (files.hotDealImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       hotDealImages = [...hotDealImages, ...imageUrl.hotDealImages];
//     } else if (files.hotMainImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       hotMainImages = [...hotMainImages, ...imageUrl.hotMainImages];
//     } else if (files.reviewImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       reviewImages = [...reviewImages, ...imageUrl.reviewImages];
//     } else if (files.reviewMainImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       reviewMainImages = [...reviewMainImages, ...imageUrl.reviewMainImages];
//     } else if (files.footerImages) {
//       const imageUrl = sendShopImageToCPanel(req);
//       footerImages = [...footerImages, ...imageUrl.footerImages];
//     }
//   }

//   let hours = existingImage.hours;
//   let minutes = existingImage.minutes;
//   if (homePageData.hours !== undefined) hours = new Decimal(homePageData.hours);
//   if (homePageData.minutes !== undefined)
//     minutes = new Decimal(homePageData.minutes);

//   const result = await prisma.homePageImages.update({
//     where: {
//       id: "home_page_single_entry",
//     },
//     data: {
//       sliderImages: sliderImages,
//       heroImages: heroImages,
//       hotDealImages: hotDealImages,
//       hotMainImages: hotMainImages,
//       reviewImages: reviewImages,
//       reviewMainImages: reviewMainImages,
//       footerImages: footerImages,
//       hours: hours,
//       minutes: minutes,
//     },
//   });

//   return result;
// };

const getHomePageImages = async () => {
  const result = await prisma.homePageImages.findFirstOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });

  return result;
};

const sliderImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let sliderImages = existingImage.sliderImages || [];
  if (
    homePageData.removeSliderImages &&
    Array.isArray(homePageData.removeSliderImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeSliderImages);
    sliderImages = sliderImages.filter(
      (img) => !homePageData.removeSliderImages.includes(img)
    );
  }

  if (req.files) {
    if (files.sliderImages) {
      const imageUrl = sendShopImageToCPanel(req);
      sliderImages = [...sliderImages, ...imageUrl.sliderImages];
    }
  }

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      sliderImages: sliderImages,
    },
  });

  return result;
};
const heroImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let heroImages = existingImage.heroImages || [];
  if (
    homePageData.removeHeroImages &&
    Array.isArray(homePageData.removeHeroImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeHeroImages);
    heroImages = heroImages.filter(
      (img) => !homePageData.removeHeroImages.includes(img)
    );
  }

  if (req.files) {
    if (files.heroImages) {
      const imageUrl = sendShopImageToCPanel(req);
      heroImages = [...heroImages, ...imageUrl.heroImages];
    }
  }

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      heroImages: heroImages,
    },
  });

  return result;
};

const hotDealImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let hotDealImages = existingImage.hotDealImages || [];
  if (
    homePageData.removeHotDealImages &&
    Array.isArray(homePageData.removeHotDealImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeHotDealImages);
    hotDealImages = hotDealImages.filter(
      (img) => !homePageData.removeHotDealImages.includes(img)
    );
  }

  if (req.files) {
    if (files.hotDealImages) {
      const imageUrl = sendShopImageToCPanel(req);
      hotDealImages = [...hotDealImages, ...imageUrl.hotDealImages];
    }
  }

  let hours = existingImage.hours;
  let minutes = existingImage.minutes;
  if (homePageData.hours !== undefined) hours = new Decimal(homePageData.hours);
  if (homePageData.minutes !== undefined)
    minutes = new Decimal(homePageData.minutes);

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      hotDealImages: hotDealImages,
      hours: hours,
      minutes: minutes,
    },
  });

  return result;
};
const hotMainImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let hotMainImages = existingImage.hotMainImages || [];
  if (
    homePageData.removeHotMainImages &&
    Array.isArray(homePageData.removeHotMainImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeHotMainImages);
    hotMainImages = hotMainImages.filter(
      (img) => !homePageData.removeHotMainImages.includes(img)
    );
  }

  if (req.files) {
    if (files.hotMainImages) {
      const imageUrl = sendShopImageToCPanel(req);
      hotMainImages = [...hotMainImages, ...imageUrl.hotMainImages];
    }
  }

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      hotMainImages: hotMainImages,
    },
  });

  return result;
};
const reviewImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let reviewImages = existingImage.reviewImages || [];
  if (
    homePageData.removeReviewImages &&
    Array.isArray(homePageData.removeReviewImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeReviewImages);
    reviewImages = reviewImages.filter(
      (img) => !homePageData.removeReviewImages.includes(img)
    );
  }

  if (req.files) {
    if (files.reviewImages) {
      const imageUrl = sendShopImageToCPanel(req);
      reviewImages = [...reviewImages, ...imageUrl.reviewImages];
    }
  }

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      reviewImages: reviewImages,
    },
  });

  return result;
};
const reviewMainImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let reviewMainImages = existingImage.reviewMainImages || [];
  if (
    homePageData.removeReviewMainImages &&
    Array.isArray(homePageData.removeReviewMainImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeReviewMainImages);
    reviewMainImages = reviewMainImages.filter(
      (img) => !homePageData.removeReviewMainImages.includes(img)
    );
  }

  if (req.files) {
    if (files.reviewMainImages) {
      const imageUrl = sendShopImageToCPanel(req);
      reviewMainImages = [...reviewMainImages, ...imageUrl.reviewMainImages];
    }
  }

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      reviewMainImages: reviewMainImages,
    },
  });

  return result;
};
const footerImagesUpdate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let homePageData = req.body;

  const existingImage = await prisma.homePageImages.findUniqueOrThrow({
    where: {
      id: "home_page_single_entry",
    },
  });
  let footerImages = existingImage.footerImages || [];
  if (
    homePageData.removeFooterImages &&
    Array.isArray(homePageData.removeFooterImages)
  ) {
    await deleteImagesFromCPanel(homePageData.removeFooterImages);
    footerImages = footerImages.filter(
      (img) => !homePageData.removeFooterImages.includes(img)
    );
  }

  if (req.files) {
    if (files.footerImages) {
      const imageUrl = sendShopImageToCPanel(req);
      footerImages = [...footerImages, ...imageUrl.footerImages];
    }
  }

  const result = await prisma.homePageImages.update({
    where: {
      id: "home_page_single_entry",
    },
    data: {
      footerImages: footerImages,
    },
  });

  return result;
};

export const VendorMetaServices = {
  getMyVendorMetaDataFromDB,
  getAllAdminMetaDataFromDB,
  getHomePageImages,
  sliderImagesUpdate,
  heroImagesUpdate,
  hotDealImagesUpdate,
  hotMainImagesUpdate,
  reviewImagesUpdate,
  reviewMainImagesUpdate,
  footerImagesUpdate,
};
