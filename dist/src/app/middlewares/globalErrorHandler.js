"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../../utils/share/apiError"));
const config_1 = __importDefault(require("../../config"));
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../../utils/share/errors/handleZodError"));
const client_1 = require("@prisma/client");
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b;
    //  console.error("🔥 Global Error:", err);
    let statusCode = 500;
    let success = false;
    let message = "Something Went Wrong";
    let errors = [
        {
            path: "",
            message: "Something Went Wrong",
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errors = simplifiedError.errors;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 409;
            message = "Duplicate value violates unique constraint";
            errors = [{ path: "", message }];
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            message = "Foreign key constraint failed";
            errors = [{ path: "", message }];
        }
        else if (err.code === "P2025") {
            statusCode = 404;
            message = ((_a = err.meta) === null || _a === void 0 ? void 0 : _a.cause) || "Record not found";
            errors = [{ path: String(((_b = err.meta) === null || _b === void 0 ? void 0 : _b.modelName) || ""), message }];
        }
    }
    else if (err instanceof apiError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errors = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success,
        message,
        errors,
        err: config_1.default.NODE_ENV === "development" ? err : null,
        stack: config_1.default.NODE_ENV === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
// res.status(statusCode).json({
//   success,
//   message,
//   err,
//   error: {
//     name,
//     stack,
//   },
// });
