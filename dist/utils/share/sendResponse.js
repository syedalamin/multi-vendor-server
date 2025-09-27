"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, jsonResponse) => {
    res.status(jsonResponse.statusCode).json({
        success: true,
        message: jsonResponse.message,
        meta: jsonResponse.meta || null || undefined,
        data: jsonResponse.data,
    });
};
exports.default = sendResponse;
