"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const cartCreateValidation = zod_1.default.object({
    body: zod_1.default.object({
        productId: zod_1.default.uuid().nonempty("Product is must be given"),
        quantity: zod_1.default.int().min(1, "Quantity  must be more then 0"),
    }),
});
const cartUpdateValidation = zod_1.default.object({
    body: zod_1.default.object({
        productId: zod_1.default.uuid().nonempty("Product is must be given"),
        quantity: zod_1.default.int().min(1, "Quantity  must be more then 0"),
    }),
});
exports.CartValidation = {
    cartCreateValidation,
    cartUpdateValidation
};
