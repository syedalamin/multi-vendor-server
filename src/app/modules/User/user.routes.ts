import express from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";
import auth from "../../middlewares/auth";
import { UserRole, UserStatus } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  upload.single("file"),
  formDataParser,
  validateRequest(UserValidations.adminValidation),
  UserControllers.createAdmin
);
router.post(
  "/create-vendor",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  formDataParser,
  validateRequest(UserValidations.vendorValidation),
  UserControllers.createVendor
);
router.post(
  "/create-customer",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
  formDataParser,
  validateRequest(UserValidations.customerValidation),
  UserControllers.createCustomer
);

router.get("/", auth(UserRole.ADMIN), UserControllers.getAllUserFromDB);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  UserControllers.getMyProfile
);
router.get("/:id", auth(UserRole.ADMIN), UserControllers.getByIdFromDB);
router.patch(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  upload.single("file"),
  formDataParser,
  validateRequest(UserValidations.myProfileValidation),
  UserControllers.updateMyProfile
);

router.patch(
  "/change-status/:email",
  auth(UserRole.ADMIN),
  UserControllers.changeUserStatus
);
router.patch(
  "/update-role/:email",
  auth(UserRole.ADMIN),
  // validateRequest(UserValidations.myProfileValidation),
  UserControllers.updateUserRole
);

export const UserRoutes = router;
