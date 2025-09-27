"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV,
    jwt: {
        access_Token: process.env.ACCESS_TOKEN,
        access_Token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
        refresh_Token: process.env.REFRESH_TOKEN,
        refresh_Token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_Token: process.env.RESET_TOKEN,
        reset_Token_expires_in: process.env.RESET_TOKEN_EXPIRES_IN,
    },
    sendMail: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS,
        reset_pass_link: process.env.RESET_PASS_LINK,
    },
};
