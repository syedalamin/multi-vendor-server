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
  auth(UserRole.ADMIN, UserRole.VENDOR),
  validateRequest(ProductValidation.productValidationSchema),
  ProductControllers.createDataIntoDB
);
router.get("/", ProductControllers.getAllDataFromDB);
router.get("/my-vendor",auth(UserRole.VENDOR), ProductControllers.getAllMyDataFromDB);
router.post("/ids/", ProductControllers.getByIdsFromDB);
router.get("/:id", ProductControllers.getBySlugFromDB);
router.get("/id/:id", ProductControllers.getByIdFromDB);
router.get("/related/:id", ProductControllers.relatedProducts);
router.patch(
  "/:id",
  upload.any(),
  formDataParser,
  auth(UserRole.ADMIN, UserRole.VENDOR),
  ProductControllers.updateByIdIntoDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  ProductControllers.softDeleteByIdFromDB
);


export const ProductRoutes = router;
