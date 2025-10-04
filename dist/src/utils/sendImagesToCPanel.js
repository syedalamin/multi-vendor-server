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
Object.defineProperty(exports, "__esModule", { value: true });
const sendImagesToCPanel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let fileUrls = [];
    if (req.files && Array.isArray(req.files)) {
        fileUrls = yield Promise.all(req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`));
    }
    return fileUrls;
});
exports.default = sendImagesToCPanel;
