import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ReviewControllers } from "./review.controllers";

const router = express.Router();

router.post(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  ReviewControllers.createDataIntoDB
);
router.get("/", auth(UserRole.ADMIN), ReviewControllers.getAllDataFromDB);
router.get("/:id", auth(UserRole.ADMIN), ReviewControllers.getByIdFromDB);
router.patch("/:id", auth(UserRole.ADMIN), ReviewControllers.updateByIdIntoDB);
router.delete("/:id", auth(UserRole.ADMIN), ReviewControllers.deleteByIdFromDB);

export const ReviewRoutes = router;
