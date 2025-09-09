import { Router } from "express";
import { getServices, createService, getServiceSlots, seedDevServices } from "../controllers/services.controller.js";
import { adminGuard } from "../middleware/admin.middleware.js";

const router = Router();

// Public: list available services
router.get("/", getServices);

// Public: get slots for a specific service
router.get("/:id/slots", getServiceSlots);

// Admin: create service
router.post("/", adminGuard, createService);

// Dev-only: seed default services if none exist
router.post("/seed", seedDevServices);

export default router;
