import mongoose from "mongoose";

const ORDER_STATUS = ["pending", "confirmed", "cancelled"]; // normalized spelling: cancelled

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    scheduledAt: { type: Date, required: true, index: true },
    // computed end time can be derived from service duration; cache for easier queries
    scheduledEndAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ORDER_STATUS, default: "pending", index: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
export const ORDER_STATUS_VALUES = ORDER_STATUS;

