import cron from "node-cron";
import prisma from "./share/prisma";
 

let countdownTask: any = null;

 
async function getCountdown() {
  const settings = await prisma.homePageImages.findUnique({
    where: { id: "home_page_single_entry" },
  });
  if (!settings) return 0;
 
  return (settings.hours || 0) * 60 + (settings.minutes || 0);
}

 
async function decreaseCountdown() {
  const settings = await prisma.homePageImages.findUnique({
    where: { id: "home_page_single_entry" },
  });

  if (!settings) return;

  const totalMinutes = (settings.hours || 0) * 60 + (settings.minutes || 0);

  if (totalMinutes > 0) {
    const newTotal = totalMinutes - 1;
    const newHours = Math.floor(newTotal / 60);
    const newMinutes = newTotal % 60;

    await prisma.homePageImages.update({
      where: { id: "home_page_single_entry" },
      data: { hours: newHours, minutes: newMinutes },
    });

    // console.log(
    //   `⏱ Countdown updated → ${newHours}h ${newMinutes}m (at ${new Date().toLocaleTimeString()})`
    // );

    if (newTotal <= 0) {
   
      stopCountdownCron();
    }
  } else {
 
    stopCountdownCron();
  }
}

 
export async function startCountdownCron() {
  const total = await getCountdown();
  if (total <= 0) {
    
    return;
  }

  if (countdownTask) {
   
    return;
  }

  countdownTask = cron.schedule("*/60 * * * * *", async () => {
    await decreaseCountdown();
  });

  countdownTask.start();
 
}

 
export function stopCountdownCron() {
  if (countdownTask) {
    countdownTask.stop();
    countdownTask = null;
    console.log("🛑 Countdown cron stopped.");
  }
}
