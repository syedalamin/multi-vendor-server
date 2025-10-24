"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("./user.controllers");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const fileUploader_1 = require("../../../utils/fileUploader");
const formDataParser_1 = __importDefault(require("../../../utils/formDataParser"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-admin", fileUploader_1.upload.single("file"), formDataParser_1.default, (0, validateRequest_1.default)(user_validation_1.UserValidations.adminValidation), user_controllers_1.UserControllers.createAdmin);
router.post("/create-vendor", fileUploader_1.upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]), formDataParser_1.default, (0, validateRequest_1.default)(user_validation_1.UserValidations.vendorValidation), user_controllers_1.UserControllers.createVendor);
router.post("/create-customer", 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
fileUploader_1.upload.single("file"), formDataParser_1.default, (0, validateRequest_1.default)(user_validation_1.UserValidations.customerValidation), user_controllers_1.UserControllers.createCustomer);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controllers_1.UserControllers.getAllUserFromDB);
router.get("/me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), user_controllers_1.UserControllers.getMyProfile);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controllers_1.UserControllers.getByIdFromDB);
router.patch("/me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), fileUploader_1.upload.single("file"), formDataParser_1.default, (0, validateRequest_1.default)(user_validation_1.UserValidations.myProfileValidation), user_controllers_1.UserControllers.updateMyProfile);
router.patch("/change-status/:email", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controllers_1.UserControllers.changeUserStatus);
router.patch("/update-role/:email", (0, auth_1.default)(client_1.UserRole.ADMIN), 
// validateRequest(UserValidations.myProfileValidation),
user_controllers_1.UserControllers.updateUserRole);
exports.UserRoutes = router;
