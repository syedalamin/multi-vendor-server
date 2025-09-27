"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const review_controllers_1 = require("./review.controllers");
const router = express_1.default.Router();
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), review_controllers_1.ReviewControllers.createDataIntoDB);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), review_controllers_1.ReviewControllers.getAllDataFromDB);
router.get("/:id", review_controllers_1.ReviewControllers.getByIdFromDB);
exports.ReviewRoutes = router;
