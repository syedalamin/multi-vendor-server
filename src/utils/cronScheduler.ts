import cron from "node-cron";
import prisma from "./share/prisma";
import { Decimal } from "@prisma/client/runtime/library";

let countdownTask: any = null;

async function getCountdown() {
  const settings = await prisma.homePageImages.findUnique({
    where: { id: "home_page_single_entry" },
  });
  if (!settings) return new Decimal(0);

  const hours = new Decimal(settings.hours);
  const minutes = new Decimal(settings.minutes);

  return hours.mul(60).add(minutes); // Decimal arithmetic
}

async function decreaseCountdown() {
  const settings = await prisma.homePageImages.findUnique({
    where: { id: "home_page_single_entry" },
  });
  if (!settings) return;

  const hours = new Decimal(settings.hours);
  const minutes = new Decimal(settings.minutes);

  let totalMinutes = hours.mul(60).add(minutes);

  if (totalMinutes.gt(0)) {
    totalMinutes = totalMinutes.sub(1);

    const newHours = totalMinutes.div(60).floor();
    const newMinutes = totalMinutes.mod(60);

    await prisma.homePageImages.update({
      where: { id: "home_page_single_entry" },
      data: {
        hours: newHours,
        minutes: newMinutes,
      },
    });

    if (totalMinutes.lte(0)) stopCountdownCron();
  } else {
    stopCountdownCron();
  }
}

export async function startCountdownCron() {
  if (countdownTask) {
    countdownTask.stop();
    countdownTask = null;
  }

  const total = await getCountdown();
  if (total.lte(0)) {
    return;
  }

  countdownTask = cron.schedule("*/1 * * * *", async () => {
    await decreaseCountdown();
  });

  countdownTask.start();
}

export function stopCountdownCron() {
  if (countdownTask) {
    countdownTask.stop();
    countdownTask = null;
  }
}
