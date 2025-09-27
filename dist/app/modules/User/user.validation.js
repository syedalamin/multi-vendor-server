"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const adminValidation = zod_1.default.object({
    body: zod_1.default.object({
        password: zod_1.default.string(),
        admin: zod_1.default.object({
            firstName: zod_1.default
                .string()
                .min(2, { message: "First Name must be 2 characters" })
                .max(20, { message: "First Name must be at most 20 characters" }),
            middleName: zod_1.default.string().optional(),
            lastName: zod_1.default
                .string()
                .min(2, { message: "Last Name must be 2 characters" })
                .max(20, { message: "First Name must be at most 20 characters" }),
            email: zod_1.default.email(),
            contactNumber: zod_1.default.string({}),
            gender: zod_1.default.enum(["MALE", "FEMALE"]),
        }),
    }),
});
const vendorValidation = zod_1.default.object({
    body: zod_1.default.object({
        password: zod_1.default.string(),
        vendor: zod_1.default.object({
            shopName: zod_1.default
                .string({ message: "Shop Name is required" })
                .min(2, { message: "Shop Name must be 2 characters" })
                .max(20, { message: "Shop Name must be lest then  20 characters" }),
            email: zod_1.default.email({ message: "Shop Email is required" }),
            contactNumber: zod_1.default
                .string({ message: "Contact Number is required" })
                .min(1, "Contact Number is required "),
            district: zod_1.default
                .string({ message: "Shop Address is required" })
                .min(1, "Address is required "),
            city: zod_1.default
                .string({ message: "Shop Address is required" })
                .min(1, "Address is required "),
        }),
    }),
});
// const customerValidation = z.object({
//   body: z.object({
//     password: z.string(),
//     customer: z.object({
//       firstName: z
//         .string()
//         .min(2, { message: "First Name must be 2 characters" })
//         .max(20, { message: "First Name must be at most 20 characters" }),
//       middleName: z.string().optional(),
//       lastName: z
//         .string()
//         .min(2, { message: "Last Name must be 2 characters" })
//         .max(20, { message: "First Name must be at most 20 characters" }),
//       email: z.email(),
//       contactNumber: z.string().optional(),
//     }),
//   }),
// });
const customerValidation = zod_1.default.object({
    body: zod_1.default.object({
        password: zod_1.default.string(),
        customer: zod_1.default.object({
            email: zod_1.default.email(),
        }),
    }),
});
const myProfileValidation = zod_1.default.object({
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
exports.UserValidations = {
    adminValidation,
    vendorValidation,
    customerValidation,
    myProfileValidation,
};
