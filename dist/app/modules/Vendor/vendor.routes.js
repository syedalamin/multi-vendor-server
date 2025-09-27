"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const vendor_controllers_1 = require("./vendor.controllers");
const fileUploader_1 = require("../../../utils/fileUploader");
const formDataParser_1 = __importDefault(require("../../../utils/formDataParser"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vendor_validation_1 = require("./vendor.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), vendor_controllers_1.VendorControllers.getAllDataFromDB);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), vendor_controllers_1.VendorControllers.getByIdFromDB);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]), formDataParser_1.default, (0, validateRequest_1.default)(vendor_validation_1.VendorValidation.vendorUpdateValidation), vendor_controllers_1.VendorControllers.updateByIdIntoDB);
router.patch("/verify/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), vendor_controllers_1.VendorControllers.verifyUpdateByIdIntoDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), vendor_controllers_1.VendorControllers.deleteByIdFromDB);
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), vendor_controllers_1.VendorControllers.softDeleteByIdFromDB);
exports.VendorRoutes = router;
