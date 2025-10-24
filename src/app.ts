import express from "express";
import cors from "cors";
import { Routers } from "./app/routers";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./utils/notFound";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

//! use  parser

app.use(
  cors({
    origin: [
      "https://multi-vendor-five.vercel.app",
      "https://trustyshoptbd.com",
      "http://localhost:3000",
      "http://192.168.0.102:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//! routers use
app.use("/api/v1", Routers);

app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//! not found path
app.use(notFound);

//! error
app.use(globalErrorHandler);

export default app;
