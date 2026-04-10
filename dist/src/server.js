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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const cronScheduler_1 = require("./utils/cronScheduler");
const logger_1 = __importDefault(require("./utils/share/logger"));
const seed_1 = require("../prisma/seed");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = app_1.default.listen(Number(config_1.default.port), "0.0.0.0", () => {
            console.log(`🚀 Server listening on port ${config_1.default.port}`);
            logger_1.default.info(`🚀 Server running on port ${config_1.default.port}`);
            if (config_1.default.NODE_ENV !== "production") {
                (0, cronScheduler_1.startCountdownCron)();
                seed_1.seedDatabase.createHomePageImages();
                seed_1.seedDatabase.seedAdmin();
            }
        });
        const gracefulShutdown = (signal) => {
            logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
            server.close(() => {
                logger_1.default.info("HTTP server closed");
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.default.error("Forced shutdown after timeout");
                process.exit(1);
            }, 10000);
        };
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        process.on("uncaughtException", (err) => {
            logger_1.default.error(`Uncaught Exception: ${err.message}`);
            process.exit(1);
        });
        process.on("unhandledRejection", (err) => {
            logger_1.default.error(`Unhandled Rejection: ${err}`);
            process.exit(1);
        });
    });
}
main();
