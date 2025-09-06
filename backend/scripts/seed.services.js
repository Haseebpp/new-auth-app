import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Service } from "../models/service.model.js";

dotenv.config();

const services = [
  { name: "Basic Wash", description: "Quick exterior wash", durationMinutes: 30, price: 10, active: true },
  { name: "Full Wash", description: "Exterior + interior cleaning", durationMinutes: 60, price: 25, active: true },
  { name: "Detailing", description: "Premium detailing service", durationMinutes: 120, price: 80, active: true },
];

async function run() {
  try {
    await connectDB();
    const existing = await Service.countDocuments();
    if (existing > 0) {
      console.log(`Services already exist (${existing}). Skipping.`);
      process.exit(0);
    }
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} services.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

