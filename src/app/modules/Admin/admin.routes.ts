import { UserRole } from "@prisma/client";
import express from "express";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminControllers } from "./admin.controllers";
import { AdminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);
router.get("/:id", auth(UserRole.ADMIN), AdminControllers.getByIdFromDB);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  upload.single("file"),
  formDataParser,
  validateRequest(AdminValidations.adminUpdateValidation),
  AdminControllers.updateByIdFrmDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN),
  AdminControllers.softDeleteFromDB
);
router.delete("/:id", auth(UserRole.ADMIN), AdminControllers.deleteFromDB);
export const AdminRoutes = router;
