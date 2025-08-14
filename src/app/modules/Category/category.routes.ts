import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryControllers } from "./category.controllers";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";
const router = express.Router();

router.post(
  "/create-category",
  upload.single("file"),
  formDataParser,
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidations.categoryValidation),
  CategoryControllers.createCategoryIntoDB
);
router.get("/",  CategoryControllers.getAllCategoryFromDB);
router.get("/:id",  CategoryControllers.getByIdFromDB);
router.patch(
  "/:id",
  upload.single("file"),
  formDataParser,
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidations.updateCategoryValidation),
  CategoryControllers.updateByIdIntoDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN),
  CategoryControllers.softDeleteByIdFromDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CategoryControllers.deleteByIdFromDB
);

export const CategoryRoutes = router;
