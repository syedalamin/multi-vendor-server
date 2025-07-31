import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ProductControllers } from "./product.controllers";



const router = express.Router();

router.post(
  "/create-product",
  auth(UserRole.ADMIN),
  ProductControllers.createDataIntoDB
);
router.get(
  "/",
  auth(UserRole.ADMIN),
  ProductControllers.getAllDataFromDB
);
router.get("/:id", auth(UserRole.ADMIN), ProductControllers.getByIdFromDB);
router.patch("/:id", auth(UserRole.ADMIN), ProductControllers.updateByIdIntoDB);
router.delete("/:id", auth(UserRole.ADMIN), ProductControllers.deleteByIdFromDB);

export const ProductRoutes = router;
