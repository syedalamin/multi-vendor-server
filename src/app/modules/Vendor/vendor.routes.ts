import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { VendorControllers } from "./vendor.controllers";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";
import validateRequest from "../../middlewares/validateRequest";
import { VendorValidation } from "./vendor.validation";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), VendorControllers.getAllDataFromDB);
router.get("/:id", auth(UserRole.ADMIN), VendorControllers.getByIdFromDB);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  formDataParser,
  validateRequest(VendorValidation.vendorUpdateValidation),
  VendorControllers.updateByIdIntoDB
);
router.delete("/:id", auth(UserRole.ADMIN), VendorControllers.deleteByIdFromDB);
router.delete("/soft/:id", auth(UserRole.ADMIN), VendorControllers.softDeleteByIdFromDB);

export const VendorRoutes = router;
