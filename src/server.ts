import { Server } from "http";
import app from "./app";
import config from "./config";
import { startCountdownCron } from "./utils/cronScheduler";
import logger from "./utils/share/logger";
import { seedDatabase } from "../prisma/seed";

async function main() {
  const server: Server = app.listen(Number(config.port), "0.0.0.0", () => {
    console.log(`🚀 Server listening on port ${config.port}`);
    logger.info(`🚀 Server running on port ${config.port}`);
    
    if (config.NODE_ENV !== "production") {
      startCountdownCron();
      seedDatabase.createHomePageImages();
      seedDatabase.seedAdmin();
    }
  });

  const gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
  process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err}`);
    process.exit(1);
  });
}

main();
