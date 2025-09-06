import asyncHandler from "express-async-handler";
import { Order } from "../models/order.model.js";
import { Service } from "../models/service.model.js";

const parseDate = (v) => {
  try {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

// POST /api/orders - create new order (auth required)
export const createOrder = asyncHandler(async (req, res) => {
  const { serviceId, scheduledAt, notes = "" } = req.body || {};
  if (!serviceId || !scheduledAt) {
    return res.status(422).json({ message: "Validation failed", errors: { serviceError: !serviceId && "serviceId required", scheduledAtError: !scheduledAt && "scheduledAt required" } });
  }

  const service = await Service.findById(serviceId);
  if (!service || !service.active) return res.status(404).json({ message: "Service not found" });

  const start = parseDate(scheduledAt);
  if (!start) return res.status(422).json({ message: "Invalid scheduledAt" });

  const now = new Date();
  if (start.getTime() <= now.getTime()) return res.status(422).json({ message: "scheduledAt must be in the future" });

  const end = new Date(start.getTime() + service.durationMinutes * 60000);

  // Prevent double-booking: check any overlapping order for the same service
  const conflict = await Order.findOne({ service: service._id, status: { $ne: "cancelled" }, scheduledAt: { $lt: end }, scheduledEndAt: { $gt: start }, });
  if (conflict) return res.status(409).json({ message: "Time slot not available" });

  const order = await Order.create({ user: req.user._id, service: service._id, scheduledAt: start, scheduledEndAt: end, status: "pending", notes: String(notes || "").trim() });

  await order.populate("service", "name durationMinutes price");
  res.status(201).json({ order });
});

// GET /api/orders - get orders
// - Admin: all orders or filter by user via ?user=id
// - User: only own orders
export const getOrders = asyncHandler(async (req, res) => {
  const isAdmin = Boolean(req.user?.isAdmin);
  const filter = {};
  if (isAdmin) {
    const userFilter = req.query.user;
    if (userFilter) filter.user = userFilter;
  } else {
    filter.user = req.user._id;
  }

  const orders = await Order.find(filter)
    .populate("service", "name durationMinutes price")
    .populate("user", "name number")
    .sort({ scheduledAt: -1 });
  res.json({ orders });
});

// Optional: PATCH /api/orders/:id/cancel - allow user or admin to cancel own order
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  const isAdmin = Boolean(req.user?.isAdmin);
  if (!isAdmin && String(order.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (order.status === "cancelled") return res.json({ order });
  order.status = "cancelled";
  await order.save();
  res.json({ order });
});

