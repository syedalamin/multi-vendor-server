"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const vendorUpdateValidation = zod_1.default.object({
    body: zod_1.default.object({
        shopName: zod_1.default
            .string()
            .min(2, { message: "Shop Name must be 2 characters" })
            .max(20, { message: "Shop Name must be lest then  20 characters" })
            .optional(),
        email: zod_1.default.email().optional(),
        contactNumber: zod_1.default
            .string()
            .optional(),
        address: zod_1.default.string().optional(),
    }),
});
exports.VendorValidation = {
    vendorUpdateValidation,
};
