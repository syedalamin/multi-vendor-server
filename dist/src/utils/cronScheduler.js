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
exports.startCountdownCron = startCountdownCron;
exports.stopCountdownCron = stopCountdownCron;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("./share/prisma"));
const library_1 = require("@prisma/client/runtime/library");
let countdownTask = null;
function getCountdown() {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield prisma_1.default.homePageImages.findUnique({
            where: { id: "home_page_single_entry" },
        });
        if (!settings)
            return new library_1.Decimal(0);
        const hours = settings.hours || new library_1.Decimal(0);
        const minutes = settings.minutes || new library_1.Decimal(0);
        return hours.mul(60).add(minutes); // Decimal arithmetic
    });
}
function decreaseCountdown() {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield prisma_1.default.homePageImages.findUnique({
            where: { id: "home_page_single_entry" },
        });
        if (!settings)
            return;
        const hours = settings.hours || new library_1.Decimal(0);
        const minutes = settings.minutes || new library_1.Decimal(0);
        let totalMinutes = hours.mul(60).add(minutes);
        if (totalMinutes.gt(0)) {
            totalMinutes = totalMinutes.sub(1);
            const newHours = totalMinutes.div(60).floor(); // Decimal.div
            const newMinutes = totalMinutes.mod(60); // Decimal.mod
            yield prisma_1.default.homePageImages.update({
                where: { id: "home_page_single_entry" },
                data: {
                    hours: newHours,
                    minutes: newMinutes,
                },
            });
            if (totalMinutes.lte(0))
                stopCountdownCron();
        }
        else {
            stopCountdownCron();
        }
    });
}
function startCountdownCron() {
    return __awaiter(this, void 0, void 0, function* () {
        const total = yield getCountdown();
        if (total.lte(0))
            return;
        if (countdownTask)
            return;
        countdownTask = node_cron_1.default.schedule("*/60 * * * * *", () => __awaiter(this, void 0, void 0, function* () {
            yield decreaseCountdown();
        }));
        countdownTask.start();
    });
}
function stopCountdownCron() {
    if (countdownTask) {
        countdownTask.stop();
        countdownTask = null;
        console.log("🛑 Countdown cron stopped.");
    }
}
