import express from "express";
import cors from "cors";
import { Routers } from "./app/routers";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./utils/notFound";
import cookieParser from "cookie-parser";
import ApiError from "./utils/share/apiError";

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



//! not found path
app.use(notFound);

//! error
app.use(globalErrorHandler);

export default app;
