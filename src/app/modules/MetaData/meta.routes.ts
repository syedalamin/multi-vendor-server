import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { VendorMetaControllers } from "./meta.controllers";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";

const router = express.Router();

router.get(
  "/vendor",
  auth(UserRole.VENDOR),
  VendorMetaControllers.getMyVendorMetaDataFromDB
);

router.get(
  "/admin",
  auth(UserRole.ADMIN),
  VendorMetaControllers.getAllAdminMetaDataFromDB
);

router.get("/image", VendorMetaControllers.getHomePageImages);



router.patch(
  "/slider-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "sliderImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.sliderImagesUpdate
);
router.patch(
  "/hero-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "heroImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.heroImagesUpdate
);
router.patch(
  "/hot-deal-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "hotDealImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.hotDealImagesUpdate
);
router.patch(
  "/hot-main-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "hotMainImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.hotMainImagesUpdate
);
router.patch(
  "/review-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "reviewImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.reviewImagesUpdate
);
router.patch(
  "/review-main-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "reviewMainImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.reviewMainImagesUpdate
);
router.patch(
  "/footer-images",
  // auth(UserRole.ADMIN),
  upload.fields([{ name: "footerImages", maxCount: 5 }]),
  formDataParser,

  VendorMetaControllers.footerImagesUpdate
);

export const VendorMetaRoutes = router;

 