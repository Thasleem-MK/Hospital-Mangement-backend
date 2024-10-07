import cron from "node-cron";

const task = () => {
  console.log("Server is alive");
};

cron.schedule("*/5 * * * *", task);
