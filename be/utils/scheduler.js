import cron from "node-cron";

export const eventScheduler = () => {
  cron.schedule(
    "0 * * * * *",
    ()=>{
    },
    {
      timezone: "UTC",
    }
  );
  console.log("Scheduler initialized to run every 30 seconds.");
};
