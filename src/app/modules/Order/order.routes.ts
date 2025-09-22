import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { OrderControllers } from "./order.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  validateRequest(OrderValidation.shippingInfoValidation),
  OrderControllers.createDataIntoDB
);
router.get("/", auth(UserRole.ADMIN), OrderControllers.getAllDataFromDB);

router.get(
  "/vendor/my-order",
  auth(UserRole.VENDOR),
  OrderControllers.getMyVendorDataFromDB
);

router.get(
  "/my-order",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  OrderControllers.getMyDataFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  OrderControllers.getByIdFromDB
);
router.post(
  "/ids",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  OrderControllers.getByIdsFromDB
);
router.patch(
  "/status/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  OrderControllers.updateStatusByIdIntoDB
);
router.patch(
  "/payment-status/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  OrderControllers.updatePaymentStatusByIdIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  OrderControllers.deleteByIdFromDB
);

export const OrderRoutes = router;
