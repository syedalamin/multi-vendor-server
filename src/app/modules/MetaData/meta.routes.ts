
import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { VendorMetaControllers } from "./meta.controllers";


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

export const VendorMetaRoutes = router;