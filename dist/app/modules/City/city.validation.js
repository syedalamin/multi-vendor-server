"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const cityValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().nonempty("City name is required"),
    }),
});
const updateCityValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().optional(),
    }),
});
exports.CityValidations = {
    cityValidation,
    updateCityValidation,
};
