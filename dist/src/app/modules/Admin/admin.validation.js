"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const adminUpdateValidation = zod_1.default.object({
    body: zod_1.default.object({
        firstName: zod_1.default
            .string()
            .min(2, { message: "First Name must be 2 characters" })
            .max(20, { message: "First Name must be at most 20 characters" })
            .optional(),
        middleName: zod_1.default.string().optional(),
        lastName: zod_1.default
            .string()
            .min(2, { message: "Last Name must be 2 characters" })
            .max(20, { message: "First Name must be at most 20 characters" })
            .optional(),
        contactNumber: zod_1.default.string({}).optional(),
        gender: zod_1.default.enum(["MALE", "FEMALE"]).optional(),
    }),
});
exports.AdminValidations = {
    adminUpdateValidation,
};
