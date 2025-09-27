"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const subCategoryValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().nonempty("Sub Category name is required"),
        categoryId: zod_1.default.string().nonempty("Sub Category is required")
    }),
});
const updateSubCategoryValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().optional(),
    }),
});
exports.SubCategoryValidations = {
    subCategoryValidation,
    updateSubCategoryValidation,
};
