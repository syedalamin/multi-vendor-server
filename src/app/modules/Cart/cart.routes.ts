import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { CartControllers } from "./cart.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { CartValidation } from "./cart.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  validateRequest(CartValidation.cartCreateValidation),
  CartControllers.createDataIntoDB
);
router.get("/", auth(UserRole.ADMIN), CartControllers.getAllDataFromDB);
router.get("/:id", auth(UserRole.ADMIN), CartControllers.getByIdFromDB);
router.patch("/:id", auth(UserRole.ADMIN), CartControllers.updateByIdIntoDB);
router.delete("/:id", auth(UserRole.ADMIN), CartControllers.deleteByIdFromDB);

export const CartRoutes = router;
