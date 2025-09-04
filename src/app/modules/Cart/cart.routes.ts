import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { CartControllers } from "./cart.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { CartValidation } from "./cart.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  validateRequest(CartValidation.cartCreateValidation),
  CartControllers.createDataIntoDB
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  CartControllers.getAllDataFromDB
);
router.get(
  "/all-cart",
  auth(UserRole.ADMIN),
  CartControllers.getAllCartDataFromDB
);
router.get(
  "/cart-total",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  CartControllers.getShippingSummery
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  CartControllers.getByIdFromDB
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  validateRequest(CartValidation.cartUpdateValidation),
  CartControllers.updateByIdIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  CartControllers.deleteByIdFromDB
);

export const CartRoutes = router;
