"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const categoryValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().nonempty("Category name is required"),
    }),
});
const updateCategoryValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().optional(),
    }),
});
exports.CategoryValidations = {
    categoryValidation,
    updateCategoryValidation,
};
