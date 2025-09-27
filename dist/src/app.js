"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = require("./app/routers");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./utils/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//! use  parser
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000"
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//! routers use
app.use("/api/v1", routers_1.Routers);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//! not found path
app.use(notFound_1.default);
//! error
app.use(globalErrorHandler_1.default);
exports.default = app;
