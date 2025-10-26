"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../../utils/fileUploader");
const hero_controllers_1 = require("./hero.controllers");
const router = express_1.default.Router();
router.post("/create-hero", fileUploader_1.upload.any(), hero_controllers_1.HeroControllers.createDataIntoDB);
// router.get("/", ProductControllers.getAllDataFromDB);
// router.patch(
//   "/:id",
//   upload.any(),
//   formDataParser,
//   auth(UserRole.ADMIN, UserRole.VENDOR),
//   ProductControllers.updateByIdIntoDB
// );
exports.HeroRoutes = router;
