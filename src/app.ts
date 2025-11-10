import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { Routers } from "./app/routers";
import notFound from "./utils/notFound";

const app = express();

//! use  parser

app.use(
  cors({
    origin: [
      "https://trustyshoptbd.com",
      "http://localhost:3000",
      "http://192.168.0.102:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

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

export default app;
