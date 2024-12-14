const cron = require("node-cron");
const fetch = require("node-fetch");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running cron job...");
  try {
    const response = await fetch(
      "http://localhost:3000/api/cron/update-invoices",
      { method: "POST" }
    );
    const result = await response.json();
    console.log("Cron job result:", result);
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});

console.log("Cron job scheduler started");
