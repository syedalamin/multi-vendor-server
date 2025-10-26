"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const sendImagesToCPanel_1 = __importDefault(require("../../../utils/sendImagesToCPanel"));
const createDataIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let heroImages;
    if (req.files && Array.isArray(req.files)) {
        const imageUrl = yield (0, sendImagesToCPanel_1.default)(req);
        heroImages = imageUrl;
    }
    const result = yield prisma_1.default.homePage.create({
        data: {
            sliderImages: heroImages,
        },
    });
    return result;
});
exports.HeroServices = {
    createDataIntoDB,
};
