"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routers_1 = require("./app/routers");
const notFound_1 = __importDefault(require("./utils/notFound"));
const app = (0, express_1.default)();
//! security middleware
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);
//! cors
app.use((0, cors_1.default)({
    origin: [
        "https://trustyshoptbd.com",
        "http://localhost:3000",
        "http://192.168.0.102:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
//! parsers
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
//! routers use
app.use("/api/v1", routers_1.Routers);
app.use("/uploads", express_1.default.static("uploads"));
app.get("/", (req, res) => {
    res.send("Welcome Trusty Shop BD !");
});
//! not found path
app.use(notFound_1.default);
//! error
app.use(globalErrorHandler_1.default);
//! health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
exports.default = app;
