"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const districtValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().nonempty("District name is required"),
    }),
});
const updateDistrictValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().optional(),
    }),
});
exports.DistrictValidations = {
    districtValidation,
    updateDistrictValidation,
};
