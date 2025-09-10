import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import validateRequest from "../../middlewares/validateRequest";
import { DistrictValidations } from "./district.validation";
import { DistrictControllers } from "./district.controllers";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  validateRequest(DistrictValidations.districtValidation),
  DistrictControllers.createDistrictIntoDB
);

router.get("/", DistrictControllers.getAllDistrictFromDB);

router.get("/:id", DistrictControllers.getByIdFromDB);
router.patch(
  "/:id",

  auth(UserRole.ADMIN),
  validateRequest(DistrictValidations.updateDistrictValidation),
  DistrictControllers.updateByIdIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  DistrictControllers.deleteByIdFromDB
);

export const DistrictRoutes = router;
