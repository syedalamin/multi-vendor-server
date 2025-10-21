import { Server } from "http";
import app from "./app";
import config from "./config";
import { startCountdownCron } from "./utils/cronScheduler";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
     startCountdownCron();
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server Closed!");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  process.on("uncaughtException", (err) => {
    console.log(err);
    exitHandler();
  });
  process.on("unhandledRejection", (err) => {
    console.log(err);
    exitHandler();
  });
}

main();
