import express from "express";
import { AuthControllers } from "./auth.controllers";


const router = express.Router();

router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post(
  "/change-password",
  AuthControllers.changePassword
);
router.post("/forget-password", AuthControllers.forgetPassword);
router.post("/reset-password", AuthControllers.resetPassword);
export const AuthRoutes = router;

