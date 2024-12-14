import cron from "node-cron"
import { NotificationController, RequestController } from "../controller/index.js";
export const eventScheduler = () => {
  cron.schedule(
    "0 0 0 * * *", // Runs every day once
    // "*/10 * * * * *",
    async () => {
      try {
        //task
        await NotificationController.remindMemberTransferEnd();
        //auto send request
        await RequestController.sendRequestSponsorship();
        //auto check sponsorship
        await RequestController.updateIsSponsorship();
      } catch (error) {
        console.error("Error in cron job:", error);
      }
    },
    {
      timezone: "UTC",
    }
  );
};
