import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { InvoiceControllers } from "./invoice.controllers";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  InvoiceControllers.createDataIntoDB
);
router.get(
  "/my-invoice",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  InvoiceControllers.getAllDataFromDB
);
router.get("/latest-invoice",  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR), InvoiceControllers.getLastDataFromDB);
router.patch("/:id", auth(UserRole.ADMIN), InvoiceControllers.updateByIdIntoDB);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  InvoiceControllers.deleteByIdFromDB
);

export const InvoiceRoutes = router;
