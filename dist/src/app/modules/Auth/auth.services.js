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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const generateToken_1 = require("../../../utils/authToken/generateToken");
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const sendToEmail_1 = __importDefault(require("../../../utils/sendToEmail"));
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "Password Do Not Match");
    }
    const tokenPayload = {
        email: userData.email,
        role: userData.role,
    };
    const accessToken = generateToken_1.Token.generateToken(tokenPayload, config_1.default.jwt.access_Token, config_1.default.jwt.access_Token_expires_in);
    const refreshToken = generateToken_1.Token.generateToken(tokenPayload, config_1.default.jwt.refresh_Token, config_1.default.jwt.refresh_Token_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedUser = generateToken_1.Token.verifyToken(token, config_1.default.jwt.refresh_Token);
    if (!verifiedUser) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not AuthorizedF");
    }
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: verifiedUser.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const tokenPayload = {
        email: userData.email,
        role: userData.role,
    };
    const accessToken = generateToken_1.Token.generateToken(tokenPayload, config_1.default.jwt.access_Token, config_1.default.jwt.access_Token_expires_in);
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            password: true,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "Password Do Not Match");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password Change Successfully",
    };
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userData = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            admin: true,
            customer: true,
            vendor: true,
        },
    });
    if (!userData) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const tokenPayload = {
        email: userData.email,
        role: userData.role,
    };
    const accessToken = generateToken_1.Token.generateToken(tokenPayload, config_1.default.jwt.reset_Token, config_1.default.jwt.reset_Token_expires_in);
    const resetPassLink = config_1.default.sendMail.reset_pass_link +
        `?userId=${userData.id}&token=${accessToken}`;
    // return {
    //   accessToken,
    //   resetPassLink
    // };
    yield (0, sendToEmail_1.default)(userData.email, `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Dear ${((_a = userData === null || userData === void 0 ? void 0 : userData.admin) === null || _a === void 0 ? void 0 : _a.firstName,
        ((_b = userData === null || userData === void 0 ? void 0 : userData.admin) === null || _b === void 0 ? void 0 : _b.lastName) || ((_c = userData === null || userData === void 0 ? void 0 : userData.customer) === null || _c === void 0 ? void 0 : _c.firstName),
        ((_d = userData === null || userData === void 0 ? void 0 : userData.customer) === null || _d === void 0 ? void 0 : _d.lastName) || ((_e = userData === null || userData === void 0 ? void 0 : userData.vendor) === null || _e === void 0 ? void 0 : _e.shopName) || "User")},</p>

      <p>We received a request to reset your password. To proceed, please click the button below:</p>

      <p style="margin: 20px 0;">
        <a href="${resetPassLink}" style="text-decoration: none;">
          <button style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Reset Password
          </button>
        </a>
      </p>

      <p>If you did not request this, you can safely ignore this email. Your password will remain unchanged.</p>

      <p>Best regards,<br/>Team Trusty Shop</p>

      <hr style="margin-top: 30px;" />
      <small style="color: #888;">This is an automated message from Trusty Shop. Please do not reply directly to this email.</small>
    </div>
  `);
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const verifiedUser = generateToken_1.Token.verifyToken(payload.token, config_1.default.jwt.reset_Token);
    if (!verifiedUser) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not AuthorizedF");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password Reset Successfully",
    };
});
exports.AuthServices = {
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
