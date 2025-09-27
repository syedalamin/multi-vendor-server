"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const productValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().nonempty("Name is required").min(1, "Name must be more then 1 word"),
        description: zod_1.default.string().nonempty("Description is required"),
        price: zod_1.default.number().min(1, "Price must be more then 0"),
        subCategoryId: zod_1.default.uuid().nonempty("Sub category is required"),
        stock: zod_1.default.int().min(1, "Stock must be more then 0"),
    }),
});
exports.ProductValidation = {
    productValidationSchema,
};
