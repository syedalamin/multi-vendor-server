"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const shippingInfoValidation = zod_1.default.object({
    body: zod_1.default.object({
        firstName: zod_1.default
            .string()
            .min(2, { message: "First Name must be 2 characters" })
            .max(20, { message: "First Name must be at most 20 characters" }),
        lastName: zod_1.default
            .string()
            .min(2, { message: "Last Name must be 2 characters" })
            .max(20, { message: "First Name must be at most 20 characters" }),
        country: zod_1.default.string().nonempty("Shipping Country is required"),
        districts: zod_1.default.string(),
        city: zod_1.default.string().nonempty("Shipping City is required"),
        address: zod_1.default.string().nonempty("Shipping Address is required"),
        postalCode: zod_1.default.string(), // ৪ digit check
        phone: zod_1.default.string(),
        notes: zod_1.default.string().optional(),
    }),
});
exports.OrderValidation = {
    shippingInfoValidation,
};
