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
exports.InvoiceServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const client_1 = require("@prisma/client");
const createDataIntoDB = () => { };
const getAllDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const isInvoiceExists = yield prisma_1.default.invoice.findMany({
        where: {
            userId: userInfo.id,
        },
    });
    return isInvoiceExists;
});
const getLastDataFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    const isInvoiceExists = yield prisma_1.default.invoice.findFirst({
        where: {
            userId: userInfo.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            orderItems: true,
        }
    });
    return isInvoiceExists;
});
const updateByIdIntoDB = () => { };
const deleteByIdFromDB = () => { };
exports.InvoiceServices = {
    createDataIntoDB,
    getAllDataFromDB,
    getLastDataFromDB,
    updateByIdIntoDB,
    deleteByIdFromDB,
};
