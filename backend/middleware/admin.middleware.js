import { authGuard } from "./auth.middleware.js";

// Admin check based on env ADMIN_NUMBERS (comma-separated phone numbers)
const parseAdmins = () =>
  (process.env.ADMIN_NUMBERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const adminGuard = [
  authGuard,
  (req, res, next) => {
    const admins = parseAdmins();
    const isAdmin = Boolean(req.user && admins.includes(String(req.user.number)));
    if (!isAdmin) return res.status(403).json({ message: "Admin access required" });
    req.user.isAdmin = true; // helpful downstream
    next();
  },
];

