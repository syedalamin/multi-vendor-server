"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const invoice_controllers_1 = require("./invoice.controllers");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), invoice_controllers_1.InvoiceControllers.createDataIntoDB);
router.get("/my-invoice", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), invoice_controllers_1.InvoiceControllers.getAllDataFromDB);
router.get("/latest-invoice", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), invoice_controllers_1.InvoiceControllers.getLastDataFromDB);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), invoice_controllers_1.InvoiceControllers.updateByIdIntoDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), invoice_controllers_1.InvoiceControllers.deleteByIdFromDB);
exports.InvoiceRoutes = router;
