import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ProductControllers } from "./product.controllers";
import formDataParser from "../../../utils/formDataParser";
import { upload } from "../../../utils/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";

const router = express.Router();

router.post(
  "/create-product",
  upload.any(),
  formDataParser,
  auth(UserRole.ADMIN),
  validateRequest(ProductValidation.productValidationSchema),
  ProductControllers.createDataIntoDB
);
router.get("/", auth(UserRole.ADMIN), ProductControllers.getAllDataFromDB);
router.get("/:id", auth(UserRole.ADMIN), ProductControllers.getByIdFromDB);
router.patch(
  "/:id",
  upload.any(),
  formDataParser,
  auth(UserRole.ADMIN),
  ProductControllers.updateByIdIntoDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN),
  ProductControllers.softDeleteByIdFromDB
);

export const ProductRoutes = router;
