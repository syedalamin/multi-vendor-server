"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorMetaRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const meta_controllers_1 = require("./meta.controllers");
const fileUploader_1 = require("../../../utils/fileUploader");
const formDataParser_1 = __importDefault(require("../../../utils/formDataParser"));
const router = express_1.default.Router();
router.get("/vendor", (0, auth_1.default)(client_1.UserRole.VENDOR), meta_controllers_1.VendorMetaControllers.getMyVendorMetaDataFromDB);
router.get("/admin", (0, auth_1.default)(client_1.UserRole.ADMIN), meta_controllers_1.VendorMetaControllers.getAllAdminMetaDataFromDB);
router.get("/image", meta_controllers_1.VendorMetaControllers.getHomePageImages);
router.patch("/images", 
// auth(UserRole.ADMIN),
fileUploader_1.upload.fields([
    { name: "sliderImages", maxCount: 5 },
    { name: "heroImages", maxCount: 5 },
    { name: "hotDealImages", maxCount: 5 },
    { name: "hotMainImages", maxCount: 5 },
    { name: "reviewImages", maxCount: 5 },
    { name: "reviewMainImages", maxCount: 5 },
    { name: "footerImages", maxCount: 5 },
]), formDataParser_1.default, meta_controllers_1.VendorMetaControllers.createHomePageImages);
exports.VendorMetaRoutes = router;
