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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../src/utils/share/prisma"));
const apiError_1 = __importDefault(require("../src/utils/share/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield prisma_1.default.admin.findFirst({
            where: {
                email: "trustyshoptbd@gmail.com",
            },
        });
        if (isUserExist) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "User is already exists");
        }
        const hashedPassword = yield bcrypt_1.default.hash("trustyshoptbd@gmail.com", 12);
        const userData = {
            email: "trustyshoptbd@gmail.com",
            password: hashedPassword,
            role: client_1.UserRole.ADMIN,
        };
        yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield transactionClient.user.create({
                data: userData,
            });
            const createdAdminData = yield transactionClient.admin.create({
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
            return createdAdminData;
        }));
    }
    catch (err) {
        console.error("Admin Seed failed:", err);
    }
    finally {
        yield prisma_1.default.$disconnect();
    }
});
const createHomePageImages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.homePageImages.create({
            data: {
                id: "home_page_single_entry",
            },
        });
    }
    catch (err) {
        console.error("Admin Seed failed:", err);
    }
    finally {
        yield prisma_1.default.$disconnect();
    }
});
createHomePageImages();
seedAdmin();
