import { Server } from "http";
import app from "./app";
import config from "./config";
import { startCountdownCron } from "./utils/cronScheduler";
import logger from "./utils/share/logger";
import { seedDatabase } from "../prisma/seed";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`🚀 Example app listening on port ${config.port}`);
    logger.info(`🚀 Server running on port ${config.port}`);
    startCountdownCron();
    seedDatabase.createHomePageImages();
    seedDatabase.seedAdmin();
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server Closed!");
        logger.info(`Server Closed!`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  process.on("uncaughtException", (err) => {
    console.log(err);
    logger.error(err);
    exitHandler();
  });
  process.on("unhandledRejection", (err) => {
    console.log(err);
    logger.error(err);
    exitHandler();
  });
}

main();
