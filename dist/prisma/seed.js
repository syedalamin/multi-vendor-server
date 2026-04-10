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
exports.seedDatabase = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../src/utils/share/prisma"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: "trustyshoptbd@gmail.com" },
    });
    if (existingUser) {
        console.log("Admin already exists");
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash("trustyshoptbd@gmail.com", 12);
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email: "trustyshoptbd@gmail.com",
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
            },
        });
        yield tx.admin.create({
            data: {
                firstName: "Syed",
                lastName: "Alamin",
                email: user.email,
                contactNumber: "01315831065",
                gender: client_1.Gender.MALE,
                profilePhoto: "https://example.com/profile.jpg",
                address: "Dhaka, Bangladesh",
            },
        });
    }));
    console.log("Admin seeded successfully");
});
const createHomePageImages = () => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.homePageImages.findUnique({
        where: { id: "home_page_single_entry" },
    });
    if (!existing) {
        yield prisma_1.default.homePageImages.create({
            data: { id: "home_page_single_entry" },
        });
        console.log("Home page images entry created");
    }
});
exports.seedDatabase = {
    seedAdmin,
    createHomePageImages,
};
