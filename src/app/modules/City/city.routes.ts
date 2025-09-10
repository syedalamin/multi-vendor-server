import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import validateRequest from "../../middlewares/validateRequest";

import { CityValidations } from "./city.validation";
import { CityControllers } from "./city.controllers";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  validateRequest(CityValidations.cityValidation),
  CityControllers.createCityIntoDB
);

router.get("/", CityControllers.getAllCityFromDB);

router.get("/:id", CityControllers.getByIdFromDB);
router.patch(
  "/:id",

  auth(UserRole.ADMIN),
  validateRequest(CityValidations.updateCityValidation),
  CityControllers.updateByIdIntoDB
);

router.delete("/:id", auth(UserRole.ADMIN), CityControllers.deleteByIdFromDB);

export const CityRoutes = router;
