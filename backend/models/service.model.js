import mongoose from "mongoose";

// Basic service schema: name, description, duration (minutes), price, active, and optional daily hours
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "", trim: true },
    durationMinutes: { type: Number, required: true, min: 5 },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true, index: true },
    // Simple business hours per day (0-23). If omitted, fallback used by controller.
    openHour: { type: Number, min: 0, max: 23, default: 9 },
    closeHour: { type: Number, min: 1, max: 24, default: 17 },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);

