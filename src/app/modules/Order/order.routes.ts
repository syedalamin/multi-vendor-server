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
  "/my-order",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  OrderControllers.getMyDataFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.getByIdFromDB
);
router.patch(
  "/status/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.updateStatusByIdIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.deleteByIdFromDB
);

export const OrderRoutes = router;
