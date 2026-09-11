import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Issue from "./models/Issue.js";
import { seedIssues } from "./data/seedData.js";

(async () => {
  try {
    await connectDB();
    const deleted = await Issue.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing issues`);
    const inserted = await Issue.insertMany(seedIssues);
    console.log(`Seeded ${inserted.length} issues`);
    await mongoose.connection.close();
    console.log("DB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();
