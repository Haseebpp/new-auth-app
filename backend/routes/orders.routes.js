import { Router } from "express";
import { createOrder, getOrders, cancelOrder } from "../controllers/orders.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { adminGuard } from "../middleware/admin.middleware.js";

const router = Router();

// Create a new order (user)
router.post("/", authGuard, createOrder);

// Get orders: user sees own, admin can filter by ?user=
router.get("/", authGuard, getOrders);

// Cancel order (own or admin)
router.patch("/:id/cancel", authGuard, cancelOrder);

export default router;

