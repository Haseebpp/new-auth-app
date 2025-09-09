import asyncHandler from "express-async-handler";
import { Service } from "../models/service.model.js";
import { Order } from "../models/order.model.js";

// GET /api/services - list active services
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ active: true }).sort({ name: 1 });
  res.json({ services });
});

// POST /api/services - create a new service (admin)
export const createService = asyncHandler(async (req, res) => {
  const { name, description = "", durationMinutes, price, active = true, openHour = 9, closeHour = 17 } = req.body || {};

  if (!name || !durationMinutes || price == null) {
    return res.status(422).json({ message: "Validation failed", errors: { nameError: !name && "Name required", durationError: !durationMinutes && "Duration required", priceError: price == null && "Price required" } });
  }

  const service = await Service.create({ name: String(name).trim(), description: String(description || "").trim(), durationMinutes: Number(durationMinutes), price: Number(price), active: Boolean(active), openHour: Number(openHour), closeHour: Number(closeHour) });

  res.status(201).json({ service });
});

// GET /api/services/:id/slots?date=YYYY-MM-DD&step=30
// Basic time slot generator using service hours and existing orders
export const getServiceSlots = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, step = 30 } = req.query;
  const service = await Service.findById(id);
  if (!service || !service.active) return res.status(404).json({ message: "Service not found" });

  // date expected format: YYYY-MM-DD
  const day = date || new Date().toISOString().slice(0, 10);
  const [year, month, dayOfMonth] = day.split("-").map((n) => Number(n));
  if (!year || !month || !dayOfMonth) return res.status(422).json({ message: "Invalid date format" });

  const openHour = Number(service.openHour ?? 9);
  const closeHour = Number(service.closeHour ?? 17);
  const stepMinutes = Math.max(5, Number(step));
  const duration = Number(service.durationMinutes);

  const dayStart = new Date(Date.UTC(year, month - 1, dayOfMonth, openHour, 0, 0));
  const dayEnd = new Date(Date.UTC(year, month - 1, dayOfMonth, closeHour, 0, 0));

  // Fetch existing orders for the service for the day
  const existing = await Order.find({ service: service._id, status: { $ne: "cancelled" }, scheduledAt: { $lt: dayEnd }, scheduledEndAt: { $gt: dayStart }, }).select("scheduledAt scheduledEndAt");

  const slots = [];
  for (let t = dayStart.getTime(); t + duration * 60000 <= dayEnd.getTime(); t += stepMinutes * 60000) {
    const slotStart = new Date(t);
    const slotEnd = new Date(t + duration * 60000);
    // Future-only constraint
    const now = new Date();
    if (slotStart <= now) continue;
    // Check overlap with existing orders
    const overlaps = existing.some((o) => !(slotEnd <= o.scheduledAt || slotStart >= o.scheduledEndAt));
    if (!overlaps) slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
  }

  res.json({ slots, service: { id: String(service._id), durationMinutes: duration, openHour, closeHour } });
});

// POST /api/services/seed - development helper to seed default services if none exist
export const seedDevServices = asyncHandler(async (req, res) => {
  // Disallow in production for safety
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Seeding disabled in production" });
  }

  const existing = await Service.countDocuments();
  if (existing > 0) {
    const services = await Service.find({ active: true }).sort({ name: 1 });
    return res.status(200).json({ message: `Services already exist (${existing}).`, services });
  }

  const defaults = [
    { name: "Basic Wash", description: "Quick exterior wash", durationMinutes: 30, price: 10, active: true },
    { name: "Full Wash", description: "Exterior + interior cleaning", durationMinutes: 60, price: 25, active: true },
    { name: "Detailing", description: "Premium detailing service", durationMinutes: 120, price: 80, active: true },
  ];

  await Service.insertMany(defaults);
  const services = await Service.find({ active: true }).sort({ name: 1 });
  return res.status(201).json({ message: `Seeded ${services.length} services.`, services });
});
