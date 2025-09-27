"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const district_validation_1 = require("./district.validation");
const district_controllers_1 = require("./district.controllers");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(district_validation_1.DistrictValidations.districtValidation), district_controllers_1.DistrictControllers.createDistrictIntoDB);
router.get("/", district_controllers_1.DistrictControllers.getAllDistrictFromDB);
router.get("/:id", district_controllers_1.DistrictControllers.getByIdFromDB);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(district_validation_1.DistrictValidations.updateDistrictValidation), district_controllers_1.DistrictControllers.updateByIdIntoDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), district_controllers_1.DistrictControllers.deleteByIdFromDB);
exports.DistrictRoutes = router;
