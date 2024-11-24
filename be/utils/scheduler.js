import cron from "node-cron"
import { NotificationController } from "../controller/index.js";
export const eventScheduler = () => {
  cron.schedule(
    "0 0 0 * * *", // Runs every day once
    async () => {
      //task
      await NotificationController.remindMemberTransferEnd()
    },
    {
      timezone: "UTC",
    }
  );
};
