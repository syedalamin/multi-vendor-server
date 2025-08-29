import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { SubCategoryControllers } from "./sub.category.controllers";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";
import validateRequest from "../../middlewares/validateRequest";
import { SubCategoryValidations } from "./sub.category.validation";

const router = express.Router();

router.post(
  "/create-sub-category",
  upload.single("file"),
  formDataParser,
  auth(UserRole.ADMIN),
  validateRequest(SubCategoryValidations.subCategoryValidation),
  SubCategoryControllers.createSubCategoryIntoDB
);
router.get("/", SubCategoryControllers.getAllSubCategoryFromDB);
router.get("/:slug", SubCategoryControllers.getBySlugFromDB);
router.patch(
  "/:id",
  upload.single("file"),
  formDataParser,
  auth(UserRole.ADMIN),
  validateRequest(SubCategoryValidations.updateSubCategoryValidation),
  SubCategoryControllers.updateByIdIntoDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN),
  SubCategoryControllers.softDeleteByIdFromDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  SubCategoryControllers.deleteByIdFromDB
);

export const SubCategoryRoutes = router;
