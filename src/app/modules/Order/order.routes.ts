import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { OrderControllers } from "./order.controllers";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.createDataIntoDB
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.getAllDataFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.updateByIdIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.deleteByIdFromDB
);

export const OrderRoutes = router;
