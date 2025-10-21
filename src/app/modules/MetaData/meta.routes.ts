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

router.post(
  "/images",
  auth(UserRole.ADMIN),
  upload.fields([
    { name: "sliderImages", maxCount: 5 },
    { name: "heroImages", maxCount: 5 },
    { name: "hotDealImages", maxCount: 2 },
    { name: "hotMainImages", maxCount: 2 },
    { name: "reviewImages", maxCount: 5 },
    { name: "reviewMainImages", maxCount: 2 },
    { name: "footerImages", maxCount: 2 },
  ]),
  formDataParser,

  VendorMetaControllers.createHomePageImages
);

export const VendorMetaRoutes = router;
