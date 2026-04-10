import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { Routers } from "./app/routers";
import notFound from "./utils/notFound";
import config from "./config";

const app = express();

//! security middleware

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

//! cors
app.use(
  cors({
    origin: [
      "https://trustyshoptbd.com",
      "http://localhost:3000",
      "http://192.168.0.102:3000",
      "https://multi-vendor-five.vercel.app",
      "https://multi-vendor-git-main-syedalamins-projects.vercel.app",
      "https://multi-vendor-lha8bbw0r-syedalamins-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

//! parsers
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//! routers use
app.use("/api/v1", Routers);

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Welcome Trusty Shop BD !");
});

//! not found path
app.use(notFound);

//! error
app.use(globalErrorHandler);

//! health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
