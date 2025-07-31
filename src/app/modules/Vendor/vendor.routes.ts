import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { VendorControllers } from "./vendor.controllers";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), VendorControllers.getAllDataFromDB);
router.get("/:id", auth(UserRole.ADMIN), VendorControllers.getByIdFromDB);
router.patch("/:id", auth(UserRole.ADMIN), VendorControllers.updateByIdIntoDB);
router.delete("/:id", auth(UserRole.ADMIN), VendorControllers.deleteByIdFromDB);

export const VendorRoutes = router;
