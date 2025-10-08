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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const deleteImagesFromCPanel = (imageUrls) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0)
        return;
    yield Promise.all(imageUrls.map((imgUrl) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fileName = imgUrl.split("/uploads/")[1];
            if (!fileName)
                return;
            const filePath = path_1.default.join(process.cwd(), "uploads", fileName);
            yield promises_1.default.unlink(filePath);
        }
        catch (err) {
            if (err.code === "ENOENT") {
                console.warn(`⚠️ File not found: ${imgUrl}`);
            }
            else {
                console.error(`❌ Error deleting ${imgUrl}:`, err);
            }
        }
    })));
});
exports.default = deleteImagesFromCPanel;
