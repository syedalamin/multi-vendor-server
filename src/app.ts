import express from "express";
import cors from "cors";
import { Routers } from "./app/routers";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./utils/notFound";
import cookieParser from "cookie-parser";

const app = express();

//! use  parser
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.102:3000",
      "https://multi-vendor-five.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//! routers use
app.use("/api/v1", Routers);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//! error
app.use(globalErrorHandler);
//! not found path
app.use(notFound);
export default app;
